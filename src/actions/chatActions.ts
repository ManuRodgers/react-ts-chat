import { actionCreatorFactory } from 'dva-model-creator';
import { IGenius, IBoss } from '../interfaces/index';
import { ChatDto } from '../dto/chat.dto';
const chatActionCreator = actionCreatorFactory('chat');

// chat info
export const setIsGettingTargetUser = chatActionCreator<{ isGettingTargetUser: boolean }>(
  'setIsGettingTargetUser',
);

export const getTargetUserByIdSync = chatActionCreator<{ targetUser: IGenius | IBoss }>(
  'getTargetUserByIdSync',
);
export const getTargetUserByIdAsync = chatActionCreator<{ id: string }>('getTargetUserByIdAsync');
export const sendMsgAsync = chatActionCreator<ChatDto>('sendMsgAsync');
export const sendMsgSync = chatActionCreator<ChatDto>('sendMsgSync');
export const receiveMsgAsync = chatActionCreator<{}>('receiveMsgAsync');

// CombinedIdChatList
export const getCombinedIdChatListSync = chatActionCreator<{ combinedIdChatList: [] }>(
  'getCombinedIdChatListSync',
);
export const getCombinedIdChatListAsync = chatActionCreator<{ combinedId: string }>(
  'getCombinedIdChatListAsync',
);
export const setIsGettingCombinedIdChatList = chatActionCreator<{
  isGettingCombinedIdChatList: boolean;
}>('setIsGettingCombinedIdChatList');
