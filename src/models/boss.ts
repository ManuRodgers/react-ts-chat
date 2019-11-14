import { DvaModelBuilder } from 'dva-model-creator';
import axios, { AxiosResponse } from 'axios';
import { router } from 'umi';

import { IGlobalState, IGenius } from '@/interfaces';
import {
  setAvatar,
  setTitle,
  setCompany,
  setMoney,
  setDescription,
  setIsUpdatingBossInfo,
  bossInfoSync,
  bossInfoAsync,
  setIsGettingGeniusList,
  getGeniusListSync,
  getGeniusListAsync,
  logoutBossInfoSync,
} from '@/actions/bossActions';
import { setErrorMsg } from '@/actions/authActions';
import { getRedirectPath } from '@/util/redirectTo';
import { BossInfoDto } from '@/dto/bossInfo.dto';
import { CodeNumber } from '@/enum';

const initState: IGlobalState['boss'] = {
  geniusList: [],
  isGettingGeniusList: false,
  isUpdatingBossInfo: false,
  avatar: '',
  title: '',
  company: '',
  money: '',
  description: '',
};
const bossBuilder = new DvaModelBuilder(initState, 'boss')
  .case(setAvatar, (state, { avatar }) => ({ ...state, avatar }))
  .case(setTitle, (state, { title }) => ({ ...state, title }))
  .case(setCompany, (state, { company }) => ({ ...state, company }))
  .case(setMoney, (state, { money }) => ({ ...state, money }))
  .case(setDescription, (state, { description }) => ({ ...state, description }))
  .case(setIsUpdatingBossInfo, (state, { isUpdatingBossInfo }) => ({
    ...state,
    isUpdatingBossInfo,
  }))
  .case(setIsGettingGeniusList, (state, { isGettingGeniusList }) => ({
    ...state,
    isGettingGeniusList,
  }))
  .case(bossInfoSync, (state, { avatar, title, company, money, description }) => {
    return { ...state, avatar, title, company, money, description };
  })
  .case(logoutBossInfoSync, (state, {}) => {
    return { ...initState };
  })
  .case(getGeniusListSync, (state, { geniusList }) => ({ ...state, geniusList }))
  .takeEvery(bossInfoAsync, function*(
    { avatar, company, description, money, title },
    { select, put },
  ) {
    try {
      if (avatar === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please select your avatar' }));
      }
      if (title === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter your title' }));
      }
      if (company === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter your company' }));
      }
      if (money === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter the money you want to pay' }));
      }
      if (description === '') {
        return yield put(setErrorMsg({ errorMsg: 'Please enter job description' }));
      }
      const accessToken = yield localStorage.getItem('access_token');
      const isUpdatingBossInfo = yield select(
        (state: IGlobalState) => state.boss.isUpdatingBossInfo,
      );
      if (isUpdatingBossInfo) {
        return;
      }
      yield put(setIsUpdatingBossInfo({ isUpdatingBossInfo: true }));
      const { data, status } = yield axios.put(
        '/api/user/updateBossInfo',
        { avatar, title, company, money, description } as BossInfoDto,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('TCL: data', data);
      console.log('TCL: status', status);
      if (status === 200) {
        yield put(setIsUpdatingBossInfo({ isUpdatingBossInfo: false }));
        const { avatar, title, company, money, description } = data.data as BossInfoDto;
        yield put(bossInfoSync({ avatar, title, company, money, description }));
        router.push('/dashboard/boss');
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('update current user no ok', data);
        yield put(setIsUpdatingBossInfo({ isUpdatingBossInfo: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsUpdatingBossInfo({ isUpdatingBossInfo: false }));
    }
  })
  .takeEvery(getGeniusListAsync, function*({}, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingGeniusList = yield select(
        (state: IGlobalState) => state.boss.isGettingGeniusList,
      );
      if (isGettingGeniusList) {
        return;
      }
      yield put(setIsGettingGeniusList({ isGettingGeniusList: true }));
      const { data, status } = yield axios.get('/api/user/geniusList', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('TCL: .takeEvery -> data', data);
      console.log('TCL: .takeEvery -> status', status);
      if (status === 200 && data.code === CodeNumber.SUCCESS) {
        yield put(setIsGettingGeniusList({ isGettingGeniusList: false }));
        yield put(getGeniusListSync({ geniusList: data.data }));
      } else {
        console.log('status', status);
        console.log('geniusList no ok', data);
        yield put(setIsUpdatingBossInfo({ isUpdatingBossInfo: false }));
      }
      console.log('TCL: data', data);
      console.log('TCL: status', status);
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingGeniusList({ isGettingGeniusList: false }));
    }
  });
export default bossBuilder.build();
