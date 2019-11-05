import { actionCreatorFactory } from 'dva-model-creator';
import { LoginDto } from '@/dto/login.dto';
import { Kind } from '@/enum';
import { RegisterDto } from '@/dto/register.dto';

import { GeniusInfoDto } from '@/dto/geniusInfo.dto';
import { BossInfoDto } from '@/dto/bossInfo.dto';

const authActionCreator = actionCreatorFactory('auth');

// sync action creators
export const setIsAuth = authActionCreator<{ isAuth: boolean }>('setIsAuth');
export const setErrorMsg = authActionCreator<{ errorMsg: string }>('setErrorMsg');
export const setSuccessMsg = authActionCreator<{ successMsg: string }>('setSuccessMsg');
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

export const getCurrentUserInfoSync = authActionCreator<{ email: string; id: string; kind: Kind }>(
  'getCurrentUserInfoSync',
);


// genius info
export const geniusInfoSync = authActionCreator<GeniusInfoDto>('geniusInfoSync');
// async action creators
export const loginAsync = authActionCreator<LoginDto>('loginAsync');
export const registerAsync = authActionCreator<RegisterDto>('registerAsync');
export const geniusInfoAsync = authActionCreator<GeniusInfoDto>('geniusInfoAsync');
export const getCurrentUserInfoAsync = authActionCreator<{ accessToken: string }>(
  'getCurrentUserInfoAsync',
);
