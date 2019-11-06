import { Dispatch } from 'redux';
import { RouterTypes } from 'umi';
import { CodeNumber } from '@/enum';
import { Kind } from '../enum/index';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}

export interface IGlobalState {
  auth: IAuthModel;
  boss: IBossModel;
  genius: IGeniusModel;
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

export interface IBossModel {
  geniusList?: [];
  isGettingGeniusList: boolean;
  avatar?: string;
  title?: string;
  company?: string;
  money?: string;
  description?: string;
  isUpdatingBossInfo?: boolean;
}
export interface IGeniusModel {
  bossList?: [];
  isGettingBossList?: boolean;
  avatar?: string;
  job?: string;
  salary?: string;
  profile?: string;
  isUpdatingGeniusInfo?: boolean;
}

export interface IResult<T> {
  code?: CodeNumber;
  statusCode?: number;
  message?: string | T;
  data?: T;
  error?: T;
  token?: string;
}

export interface IGenius {
  avatar: string;
  email: string;
  id: string;
  job: string;
  salary: string;
  profile: string;
}
export interface IBoss {
  avatar: string;
  email: string;
  id: string;
  title: string;
  company: string;
  money: string;
  description: string;
}
