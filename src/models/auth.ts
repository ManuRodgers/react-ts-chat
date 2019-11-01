import { DvaModelBuilder } from 'dva-model-creator';
import axios, { AxiosResponse } from 'axios';
import { router } from 'umi';

import { IGlobalState } from '@/interfaces';
import {
  setUserId,
  setEmail,
  setPassword,
  setKind,
  setErrorMsg,
  setIsAuth,
  loginAsync,
  setIsLogin,
  registerAsync,
  setIsRegistering,
  getCurrentUserInfoAsync,
  setIsGettingCurrentUser,
} from '@/actions/authActions';
import { Kind } from '../enum/index';
import { LoginDto } from '@/dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

const initState: IGlobalState['auth'] = {
  isAuth: false,
  errorMsg: '',
  email: '',
  userId: '',
  password: '',
  confirm: '',
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
  .case(setUserId, (state, { userId }) => ({ ...state, userId }))
  .case(setPassword, (state, { password }) => ({ ...state, password }))
  .case(setKind, (state, { kind }) => ({ ...state, kind }))
  .case(setIsAuth, (state, { isAuth }) => ({ ...state, isAuth }))
  .case(setIsRegistering, (state, { isRegistering }) => ({ ...state, isRegistering }))
  .case(setIsLogin, (state, { isLogin }) => ({ ...state, isLogin }))
  .case(setIsGettingCurrentUser, (state, { isGettingCurrentUser }) => ({
    ...state,
    isGettingCurrentUser,
  }))
  .takeEvery(loginAsync, function*({ email, password }, { select, put }) {
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
      console.log('TCL: .takeEvery -> data', data);
      console.log('TCL: .takeEvery -> status', status);
      if (status === 201) {
        yield put(setIsLogin({ isLogin: false }));
        yield getCurrentUserInfoAsync({ accessToken: data.accessToken });
        yield localStorage.setItem('access_token', data.accessToken);
      }
    } catch (error) {
      console.error(error);
      yield put(setIsLogin({ isLogin: false }));
    }
  })
  .takeEvery(registerAsync, function*({ email, password, kind }, { select, put }) {
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
      if (status === 201 && data.code === 0) {
        // register ok
        // console.log('TCL: .takeEvery -> data', data.data);
        // const { email, kind, id } = data.data;
        // yield put(setEmail({ email }));
        // yield put(setUserId({ userId: id }));
        // yield put(setKind({ kind }));
        yield put(setIsAuth({ isAuth: false }));
        yield put(setErrorMsg({ errorMsg: '' }));
        yield put(setIsRegistering({ isRegistering: false }));
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
      console.error(error);
      yield put(setIsRegistering({ isRegistering: false }));
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
      //  TODO
      yield put(setIsGettingCurrentUser({ isGettingCurrentUser: true }));
      const { data, status } = yield axios.get('/api/user/info', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('TCL: .takeEvery -> data', data);

      if (status === 200) {
        console.log('TCL: .takeEvery -> data', data);
        yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('TCL: .takeEvery -> data', data);
        yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
      }
    } catch (error) {
      console.error(error);
      yield put(setIsGettingCurrentUser({ isGettingCurrentUser: false }));
    }
  });
export default authBuilder.build();
