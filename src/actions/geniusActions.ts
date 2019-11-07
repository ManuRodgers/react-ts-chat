import { actionCreatorFactory } from 'dva-model-creator';

import { GeniusInfoDto } from '@/dto/geniusInfo.dto';

const geniusActionCreator = actionCreatorFactory('genius');

// genius info
export const setAvatar = geniusActionCreator<{ avatar: string }>('setAvatar');
export const setJob = geniusActionCreator<{ job: string }>('setJob');
export const setSalary = geniusActionCreator<{ salary: string }>('setSalary');
export const setProfile = geniusActionCreator<{ profile: string }>('setProfile');
export const setIsUpdatingGeniusInfo = geniusActionCreator<{ isUpdatingGeniusInfo: boolean }>(
  'setIsUpdatingGeniusInfo',
);
export const geniusInfoSync = geniusActionCreator<GeniusInfoDto>('geniusInfoSync');
export const logoutGeniusInfoSync = geniusActionCreator<{}>('logoutGeniusInfoSync');
export const geniusInfoAsync = geniusActionCreator<GeniusInfoDto>('geniusInfoAsync');

export const setIsGettingBossList = geniusActionCreator<{ isGettingBossList: boolean }>(
  'setIsGettingBossList',
);
export const getBossListSync = geniusActionCreator<{ bossList: [] }>('getBossListSync');
export const getBossListAsync = geniusActionCreator<{}>('getBossListAsync');
