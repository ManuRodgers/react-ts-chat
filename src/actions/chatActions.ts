import { actionCreatorFactory } from 'dva-model-creator';
import { IGenius, IBoss } from '../interfaces/index';
import { ChatDto } from '../dto/chat.dto';
import { Dispatch } from 'redux';
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
export const receiveMsgAsync = chatActionCreator<{ dispatch: Dispatch }>('receiveMsgAsync');
export const receiveMsgSync = chatActionCreator<{ newChat: ChatDto }>('receiveMsgSync');
export const readMsgAsync = chatActionCreator<{ to: string; from: string; dispatch: Dispatch }>(
  'readMsgAsync',
);
export const readMsgSync = chatActionCreator<{}>('readMsgSync');

// CombinedIdChatList
export const getCombinedIdChatListSync = chatActionCreator<{ combinedIdChatList: ChatDto[] }>(
  'getCombinedIdChatListSync',
);
export const getCombinedIdChatListAsync = chatActionCreator<{ combinedId: string }>(
  'getCombinedIdChatListAsync',
);

export const setIsGettingCombinedIdChatList = chatActionCreator<{
  isGettingCombinedIdChatList: boolean;
}>('setIsGettingCombinedIdChatList');

// ToIdChatList
export const getToIdChatListSync = chatActionCreator<{ toIdChatList: ChatDto[] }>(
  'getToIdChatListSync',
);

export const getToIdChatListAsync = chatActionCreator<{ toId: string }>('getToIdChatListAsync');

export const setIsGettingToIdChatList = chatActionCreator<{
  isGettingToIdChatList: boolean;
}>('setIsGettingToIdChatList');

// ChatList
export const getChatListSync = chatActionCreator<{ chatList: ChatDto[]; userId: string }>(
  'getChatListSync',
);

export const getChatListAsync = chatActionCreator<{ userId: string }>('getChatListAsync');

export const setIsGettingChatList = chatActionCreator<{
  isGettingChatList: boolean;
}>('setIsGettingChatList');
