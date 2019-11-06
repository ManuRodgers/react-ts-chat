import { DvaModelBuilder } from 'dva-model-creator';
import * as EmailValidator from 'email-validator';
import axios, { AxiosResponse } from 'axios';
import { router } from 'umi';

import { IGlobalState } from '@/interfaces';
import {
  setUserId,
  setEmail,
  setKind,
  setErrorMsg,
  setSuccessMsg,
  setIsAuth,
  loginAsync,
  setIsLogin,
  registerAsync,
  setIsRegistering,
  getCurrentUserInfoAsync,
  setIsGettingCurrentUser,
  getCurrentUserInfoSync,
} from '@/actions/authActions';
import { getRedirectPath } from '@/util/redirectTo';
import { Kind } from '../enum/index';
import { LoginDto } from '@/dto/login.dto';
import { RegisterDto } from '@/dto/register.dto';
import { BossInfoDto } from '@/dto/bossInfo.dto';
import { bossInfoSync } from '@/actions/bossActions';
import { GeniusInfoDto } from '@/dto/geniusInfo.dto';
import { geniusInfoSync } from '@/actions/geniusActions';

const initState: IGlobalState['auth'] = {
  isAuth: false,
  errorMsg: '',
  successMsg: '',
  email: '',
  userId: '',
  kind: Kind.GENIUS,
  isLogin: false,
  isRegistering: false,
  isGettingCurrentUser: false,
};
const authBuilder = new DvaModelBuilder(initState, 'auth')
  .case(setEmail, (state, { email }) => ({
    ...state,
    email,
  }))
  .case(setErrorMsg, (state, { errorMsg }) => ({ ...state, errorMsg }))
  .case(setSuccessMsg, (state, { successMsg }) => ({ ...state, successMsg }))
  .case(setUserId, (state, { userId }) => ({ ...state, userId }))
  .case(setKind, (state, { kind }) => ({ ...state, kind }))
  .case(setIsAuth, (state, { isAuth }) => ({ ...state, isAuth }))
  .case(setIsRegistering, (state, { isRegistering }) => ({ ...state, isRegistering }))
  .case(setIsLogin, (state, { isLogin }) => ({ ...state, isLogin }))
  .case(setIsGettingCurrentUser, (state, { isGettingCurrentUser }) => ({
    ...state,
    isGettingCurrentUser,
  }))
  .case(getCurrentUserInfoSync, (state, { email, id, kind }) => {
    // login ok
    return { ...state, email, kind, userId: id, errorMsg: '', isAuth: true, successMsg: '' };
  })
  .takeEvery(loginAsync, function*({ email, password }, { select, put }) {
    if (email === '' || password === '') {
      return yield put(setErrorMsg({ errorMsg: 'email or password cannot be empty' }));
    }
    if (!EmailValidator.validate(email)) {
      return yield put(setErrorMsg({ errorMsg: 'Please enter correct form of email' }));
    }
    try {
      const isLogin = yield select((state: IGlobalState) => state.auth.isLogin);
      if (isLogin) {
        return;
      }
      yield put(setIsLogin({ isLogin: true }));
      const { data, status } = yield axios.post('/api/auth/signin', {
        email,
        password,
      } as LoginDto);

      if (status === 201) {
        console.log(`login ok`);
        yield localStorage.setItem('access_token', data.accessToken);
        yield put(setIsLogin({ isLogin: false }));
        yield put(setErrorMsg({ errorMsg: '' }));
        yield put(getCurrentUserInfoAsync({ accessToken: data.accessToken }));
      }
    } catch (error) {
      console.log('TCL: .takeEvery -> error', error.response);
      yield put(setIsLogin({ isLogin: false }));
      if (error.response.data.statusCode === 400) {
        yield put(
          setErrorMsg({
            errorMsg: JSON.stringify(error.response.data.message[0].constraints).split(':')[1],
          }),
        );
      }
      if (error.response.data.statusCode === 401) {
        yield put(setErrorMsg({ errorMsg: `Invalid Credentials,Please Register or Login again` }));
      }
    }
  })
  .takeEvery(registerAsync, function*({ email, password, kind }, { select, put }) {
    if (email === '' || password === '') {
      return yield put(setErrorMsg({ errorMsg: 'email or password cannot be empty' }));
    }
    if (!EmailValidator.validate(email)) {
      return yield put(setErrorMsg({ errorMsg: 'Please enter correct form of email' }));
    }
    try {
      const isRegistering = yield select((state: IGlobalState) => state.auth.isRegistering);
      if (isRegistering) {
        return;
      }
      yield put(setIsRegistering({ isRegistering: true }));
      const { data, status } = yield axios.post('/api/auth/signup', {
        email,
        password,
        kind,
      } as RegisterDto);
      console.log('TCL: .takeEvery -> status', status);
      console.log('TCL: .takeEvery -> data', data);
      if (status === 201 && data.code === 0) {
        // register ok
        console.log(`register ok`);
        yield put(setIsRegistering({ isRegistering: false }));
        yield put(setIsAuth({ isAuth: false }));
        yield put(setErrorMsg({ errorMsg: '' }));
        yield put(setSuccessMsg({ successMsg: 'Register successfully please login' }));
        yield router.push('/auth/login');
      } else {
        // register not ok
        console.log(`register not ok`);
        console.log(data.error.response);
        // for unique email
        if (data.error.response.statusCode === 409) {
          yield put(
            setErrorMsg({
              errorMsg: `${data.error.response.message}`,
            }),
          );
        }
        yield put(setIsRegistering({ isRegistering: false }));
        yield put(setIsAuth({ isAuth: false }));
      }
    } catch (error) {
      console.log('TCL: .takeEvery -> error', error.response);
      yield put(setIsRegistering({ isRegistering: false }));
      yield put(setIsAuth({ isAuth: false }));
      if (error.response.data.statusCode === 400) {
        yield put(
          setErrorMsg({
            errorMsg: JSON.stringify(error.response.data.message[0].constraints).split(':')[1],
          }),
        );
      }
      if (error.response.data.statusCode === 401) {
        yield put(setErrorMsg({ errorMsg: `Invalid Credentials,Please Register or Login again` }));
      }
      yield router.push('/auth/register');
    }
  })
  .takeEvery(getCurrentUserInfoAsync, function*({ accessToken }, { select, put }) {
    try {
      const isGettingCurrentUser = yield select(
        (state: IGlobalState) => state.auth.isGettingCurrentUser,
      );
      if (isGettingCurrentUser) {
        return;
      }
      yield put(setIsGettingCurrentUser({ isGettingCurrentUser: true }));
      const { data, status } = yield axios.get('/api/user/info', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('TCL: .takeEvery -> data', data);
      if (status === 200) {
        yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
        const { email, id, kind } = data.data;
        const userAvatar = data.data.avatar;
        console.log('TCL: .takeEvery -> userAvatar', userAvatar);
        yield put(getCurrentUserInfoSync({ email, id, kind }));
        // boss
        if (userAvatar && kind == Kind.BOSS) {
          console.log(`BOSS`);
          const { avatar, title, company, money, description } = data.data as BossInfoDto;
          yield put(bossInfoSync({ avatar, title, company, money, description }));
          const whiteList = ['/dashboard/message', `/dashboard/me`];
          if (whiteList.includes(location.pathname)) {
            return;
          }
          return yield router.push(getRedirectPath(kind, userAvatar));
        }
        if (userAvatar && kind == Kind.GENIUS) {
          console.log(`GENIUS `);
          const { avatar, job, salary, profile } = data.data as GeniusInfoDto;
          yield put(geniusInfoSync({ avatar, job, salary, profile }));
          const whiteList = ['/dashboard/message', `/dashboard/me`];
          if (whiteList.includes(location.pathname)) {
            return;
          }
          return yield router.push(getRedirectPath(kind, userAvatar));
        }

        return yield router.push(getRedirectPath(kind));
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('get current user no ok', data);
        yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
    }
  });
export default authBuilder.build();
