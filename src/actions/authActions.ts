import { actionCreatorFactory } from 'dva-model-creator';
import { LoginDto } from '@/dto/login.dto';
import { Kind } from '../enum/index';
import { RegisterDto } from '@/dto/register.dto';

const authActionCreator = actionCreatorFactory('auth');

// sync action creators
export const setIsAuth = authActionCreator<{ isAuth: boolean }>('setIsAuth');
export const setErrorMsg = authActionCreator<{ errorMsg: string }>('setErrorMsg');
export const setEmail = authActionCreator<{ email: string }>('setEmail');
export const setUserId = authActionCreator<{ userId: string }>('setUserId');
export const setPassword = authActionCreator<{ password: string }>('setPassword');
export const setConfirm = authActionCreator<{ confirm: string }>('setConfirm');
export const setKind = authActionCreator<{ kind: Kind }>('setKind');
export const setIsLogin = authActionCreator<{ isLogin: boolean }>('setIsLogin');
export const setIsGettingCurrentUser = authActionCreator<{ isGettingCurrentUser: boolean }>(
  'setIsGettingCurrentUser',
);
export const setIsRegistering = authActionCreator<{ isRegistering: boolean }>('setIsRegistering');
// async action creators
export const loginAsync = authActionCreator<LoginDto>('loginAsync');
export const registerAsync = authActionCreator<RegisterDto>('registerAsync');
export const getCurrentUserInfoAsync = authActionCreator<{ accessToken: string }>(
  'getCurrentUserInfoAsync',
);
