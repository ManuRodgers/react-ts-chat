import { DvaModelBuilder } from 'dva-model-creator';
import * as EmailValidator from 'email-validator';
import axios, { AxiosResponse } from 'axios';
import { router } from 'umi';

import { IGlobalState } from '@/interfaces';
import {
  setAvatar,
  setTitle,
  setCompany,
  setMoney,
  setDescription,
  setIsUpdatingBossInfo,
  bossInfoSync,
  bossInfoAsync,
} from '@/actions/bossActions';
import { setErrorMsg } from '@/actions/authActions';
import { getRedirectPath } from '@/util/redirectTo';
import { BossInfoDto } from '@/dto/bossInfo.dto';

const initState: IGlobalState['boss'] = {
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
  .case(bossInfoSync, (state, { avatar, title, company, money, description }) => {
    return { ...state, avatar, title, company, money, description };
  })
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
  });
export default bossBuilder.build();
