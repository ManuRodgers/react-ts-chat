import { actionCreatorFactory } from 'dva-model-creator';
import { IGenius, IBoss } from '../interfaces/index';
const chatActionCreator = actionCreatorFactory('chat');

// chat info
export const setIsGettingTargetUser = chatActionCreator<{ isGettingTargetUser: boolean }>(
  'setIsGettingTargetUser',
);
export const getTargetUserByIdSync = chatActionCreator<{ targetUser: IGenius | IBoss }>(
  'getTargetUserByIdSync',
);
export const getTargetUserByIdAsync = chatActionCreator<{ id: string }>('getTargetUserByIdAsync');
export const sendMsgAsync = chatActionCreator<{ text: string; from: string; to: string }>(
  'sendMsgAsync',
);
