import { actionCreatorFactory } from 'dva-model-creator';

import { BossInfoDto } from '@/dto/bossInfo.dto';

const bossActionCreator = actionCreatorFactory('boss');

// boss info
export const setTitle = bossActionCreator<{ title: string }>('setTitle');
export const setAvatar = bossActionCreator<{ avatar: string }>('setAvatar');
export const setCompany = bossActionCreator<{ company: string }>('setCompany');
export const setMoney = bossActionCreator<{ money: string }>('setMoney');
export const setDescription = bossActionCreator<{ description: string }>('setDescription');
export const setIsUpdatingBossInfo = bossActionCreator<{ isUpdatingBossInfo: boolean }>(
  'setIsUpdatingBossInfo',
);
export const bossInfoSync = bossActionCreator<BossInfoDto>('bossInfoSync');
export const bossInfoAsync = bossActionCreator<BossInfoDto>('bossInfoAsync');