import { DvaModelBuilder } from 'dva-model-creator';
import axios, { AxiosResponse } from 'axios';
import { router } from 'umi';

import { IGlobalState } from '@/interfaces';
import {
  setAvatar,
  setJob,
  setSalary,
  setProfile,
  setIsUpdatingGeniusInfo,
  geniusInfoAsync,
  geniusInfoSync,
  setIsGettingBossList,
  getBossListSync,
  getBossListAsync,
  logoutGeniusInfoSync,
} from '@/actions/geniusActions';
import { setErrorMsg } from '@/actions/authActions';
import { getRedirectPath } from '@/util/redirectTo';
import { GeniusInfoDto } from '@/dto/geniusInfo.dto';
import { CodeNumber } from '@/enum';
import { AWS_SERVER } from '@/util/const';

const initState: IGlobalState['genius'] = {
  bossList: [],
  isGettingBossList: false,
  isUpdatingGeniusInfo: false,
  avatar: '',
  job: '',
  salary: '',
  profile: '',
};
const geniusBuilder = new DvaModelBuilder(initState, 'genius')
  .case(setAvatar, (state, { avatar }) => ({ ...state, avatar }))
  .case(setJob, (state, { job }) => ({ ...state, job }))
  .case(setSalary, (state, { salary }) => ({ ...state, salary }))
  .case(setProfile, (state, { profile }) => ({ ...state, profile }))
  .case(setIsUpdatingGeniusInfo, (state, { isUpdatingGeniusInfo }) => ({
    ...state,
    isUpdatingGeniusInfo,
  }))
  .case(setIsGettingBossList, (state, { isGettingBossList }) => ({ ...state, isGettingBossList }))
  .case(geniusInfoSync, (state, { avatar, job, salary, profile }) => {
    return { ...state, avatar, job, salary, profile };
  })
  .case(logoutGeniusInfoSync, (state, {}) => {
    return { ...initState };
  })
  .case(getBossListSync, (state, { bossList }) => ({ ...state, bossList }))
  .takeEvery(geniusInfoAsync, function*({ avatar, job, salary, profile }, { select, put }) {
    try {
      if (avatar === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please select your avatar' }));
      }
      if (job === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter your job' }));
      }
      if (salary === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter your salary' }));
      }
      if (profile === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter the profile you want to pay' }));
      }
      const accessToken = yield localStorage.getItem('access_token');
      const isUpdatingGeniusInfo = yield select(
        (state: IGlobalState) => state.genius.isUpdatingGeniusInfo,
      );
      if (isUpdatingGeniusInfo) {
        return;
      }
      yield put(setIsUpdatingGeniusInfo({ isUpdatingGeniusInfo: true }));
      const { data, status } = yield axios.put(
        `${AWS_SERVER}/user/updateGeniusInfo`,
        { avatar, job, salary, profile } as GeniusInfoDto,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('TCL: data', data);
      console.log('TCL: status', status);
      if (status === 200) {
        yield put(setIsUpdatingGeniusInfo({ isUpdatingGeniusInfo: false }));
        const { avatar, job, salary, profile } = data.data as GeniusInfoDto;
        yield put(geniusInfoSync({ avatar, job, salary, profile }));
        router.push('/dashboard/genius');
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('update current user no ok', data);
        yield put(setIsUpdatingGeniusInfo({ isUpdatingGeniusInfo: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsUpdatingGeniusInfo({ isUpdatingGeniusInfo: false }));
    }
  })
  .takeEvery(getBossListAsync, function*({}, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingBossList = yield select(
        (state: IGlobalState) => state.genius.isGettingBossList,
      );
      if (isGettingBossList) {
        return;
      }
      yield put(setIsGettingBossList({ isGettingBossList: true }));
      const { data, status } = yield axios.get(`${AWS_SERVER}/user/bossList`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (status === 200 && data.code === CodeNumber.SUCCESS) {
        yield put(setIsGettingBossList({ isGettingBossList: false }));
        yield put(getBossListSync({ bossList: data.data }));
      } else {
        console.log('status', status);
        console.log('geniusList no ok', data);
        yield put(setIsGettingBossList({ isGettingBossList: false }));
      }
      console.log('TCL: data', data);
      console.log('TCL: status', status);
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingBossList({ isGettingBossList: false }));
    }
  });
export default geniusBuilder.build();
