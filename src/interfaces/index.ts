import { Dispatch } from 'redux';
import { RouterTypes } from 'umi';
import { CodeNumber } from '@/enum';
import { Kind } from '../enum/index';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}

export interface IGlobalState {
  auth: IAuthModel;
}

export interface IAuthModel {
  isAuth?: boolean;
  userId?: string;
  email?: string;
  kind?: Kind;
  errorMsg?: string;
  successMsg?: string;
  isLogin?: boolean;
  isRegistering?: boolean;
  isGettingCurrentUser?: boolean;
}

export interface IResult<T> {
  code?: CodeNumber;
  statusCode?: number;
  message?: string | T;
  data?: T;
  error?: T;
  token?: string;
}
