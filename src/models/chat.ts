import { DvaModelBuilder } from 'dva-model-creator';
import axios from 'axios';
import io from 'socket.io-client';

import {
  getTargetUserByIdSync,
  getTargetUserByIdAsync,
  setIsGettingTargetUser,
  sendMsgAsync,
  sendMsgSync,
  receiveMsgAsync,
  receiveMsgSync,
  getCombinedIdChatListSync,
  getCombinedIdChatListAsync,
  setIsGettingCombinedIdChatList,
  getToIdChatListSync,
  getToIdChatListAsync,
  setIsGettingToIdChatList,
  getChatListSync,
  getChatListAsync,
  setIsGettingChatList,
  readMsgAsync,
  readMsgSync,
} from '@/actions/chatActions';

import { IGlobalState, IGenius } from '@/interfaces';
import { CodeNumber, Kind, Position } from '@/enum';
import { IBoss } from '../interfaces/index';
import { ChatDto } from '@/dto/chat.dto';
import { AWS_SERVER } from '@/util/const';

const socketURL = process.env.SOCKETIO_URL;
// const socketURL = process.env.SOCKETIO_URL || `ws://localhost:9093`;
const socket = io(AWS_SERVER);

const initState: IGlobalState['chat'] = {
  currentChat: {
    from: '',
    to: '',
    combinedId: '',
    text: '',
    position: Position.RIGHT,
    isRead: false,
    createdAt: 0,
  },
  chatList: [],
  combinedIdChatList: [],
  toIdChatList: [],
  targetUser: undefined,
  isGettingTargetUser: false,
  isGettingCombinedIdChatList: false,
  isGettingToIdChatList: false,
  isGettingChatList: false,
  unread: 0,
};
const chatBuilder = new DvaModelBuilder(initState, 'chat')
  .case(getTargetUserByIdSync, (state, { targetUser }) => ({ ...state, targetUser }))
  .case(getCombinedIdChatListSync, (state, { combinedIdChatList }) => ({
    ...state,
    combinedIdChatList,
    unread: combinedIdChatList.filter(chat => !chat.isRead).length,
  }))
  .case(setIsGettingCombinedIdChatList, (state, { isGettingCombinedIdChatList }) => ({
    ...state,
    isGettingCombinedIdChatList,
  }))
  .case(getToIdChatListSync, (state, { toIdChatList }) => ({
    ...state,
    toIdChatList,
    unread: toIdChatList.filter(chat => !chat.isRead).length,
  }))
  .case(setIsGettingToIdChatList, (state, { isGettingToIdChatList }) => ({
    ...state,
    isGettingToIdChatList,
  }))
  .case(getChatListSync, (state, { chatList, userId }) => ({
    ...state,
    chatList,
    unread: chatList.filter(chat => !chat.isRead && chat.to === userId).length,
  }))
  .case(setIsGettingChatList, (state, { isGettingChatList }) => ({
    ...state,
    isGettingChatList,
  }))
  .case(sendMsgSync, (state, { combinedId, createdAt, from, position, text, to, isRead }) => ({
    ...state,
    currentChat: { combinedId, createdAt, from, position, text, to, isRead },
  }))
  .case(receiveMsgSync, (state, { newChat }) => {
    // return state;
    if (
      state.combinedIdChatList.includes(newChat) ||
      state.chatList.includes(newChat) ||
      state.toIdChatList.includes(newChat)
    ) {
      return state;
    }
    return {
      ...state,
      combinedIdChatList: [...state.combinedIdChatList, newChat],
      chatList: [...state.chatList, newChat],
      toIdChatList: [...state.toIdChatList, newChat],
      unread: state.unread + 1,
    };
  })
  .takeEvery(getTargetUserByIdAsync, function*({ id }, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingTargetUser = yield select(
        (state: IGlobalState) => state.chat.isGettingTargetUser,
      );
      if (isGettingTargetUser) {
        return;
      }
      yield put(setIsGettingTargetUser({ isGettingTargetUser: true }));
      const { data, status } = yield axios.get(
        `${AWS_SERVER}/user/targetUser/${id}`,

        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('TCL: data', data);
      console.log('TCL: status', status);
      if (status === 200 && data.code === CodeNumber.SUCCESS) {
        yield put(setIsGettingTargetUser({ isGettingTargetUser: false }));
        console.log(`get target user ok`);
        if (data.data.kind === Kind.GENIUS) {
          const { avatar, email, id, job, salary, profile } = data.data as IGenius;
          return yield put(
            getTargetUserByIdSync({
              targetUser: { avatar, email, id, job, salary, profile } as IGenius,
            }),
          );
        }
        if (data.data.kind === Kind.BOSS) {
          const { avatar, email, id, title, company, money, description } = data.data as IBoss;
          return yield put(
            getTargetUserByIdSync({
              targetUser: { avatar, email, id, title, company, money, description } as IBoss,
            }),
          );
        }
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('update current user no ok', data);
        return yield put(setIsGettingTargetUser({ isGettingTargetUser: false }));
      }
    } catch (error) {
      console.error(error.response);
      return yield put(setIsGettingTargetUser({ isGettingTargetUser: false }));
    }
  })
  .takeEvery(getCombinedIdChatListAsync, function*({ combinedId }, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');

      const isGettingCombinedIdChatList = yield select(
        (state: IGlobalState) => state.chat.isGettingCombinedIdChatList,
      );
      if (isGettingCombinedIdChatList) {
        return;
      }
      yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: true }));
      const { data, status } = yield axios.post(
        `${AWS_SERVER}/chat/chatListByCombinedId`,
        { combinedId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (status === 201 && data.code === CodeNumber.SUCCESS) {
        console.log('TCL: .takeEvery -> data.data', data.data);
        yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: false }));
        yield put(getCombinedIdChatListSync({ combinedIdChatList: data.data }));
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('get chatListByCombinedId no ok', data);
        yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: false }));
    }
  })
  .takeEvery(getToIdChatListAsync, function*({ toId }, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingToIdChatList = yield select(
        (state: IGlobalState) => state.chat.isGettingToIdChatList,
      );
      if (isGettingToIdChatList) {
        return;
      }
      yield put(setIsGettingToIdChatList({ isGettingToIdChatList: true }));
      const { data, status } = yield axios.post(
        `${AWS_SERVER}/chat/chatListByToId`,
        { toId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (status === 201 && data.code === CodeNumber.SUCCESS) {
        console.log('TCL: .takeEvery -> data.data', data.data);
        yield put(setIsGettingToIdChatList({ isGettingToIdChatList: false }));
        yield put(getToIdChatListSync({ toIdChatList: data.data }));
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('get chatListByCombinedId no ok', data);
        yield put(setIsGettingToIdChatList({ isGettingToIdChatList: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingToIdChatList({ isGettingToIdChatList: false }));
    }
  })
  .takeEvery(getChatListAsync, function*({ userId }, { select, put }) {
    console.log('TCL: .takeEvery -> userId', userId);
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingChatList = yield select((state: IGlobalState) => state.chat.isGettingChatList);
      if (isGettingChatList) {
        return;
      }
      yield put(setIsGettingChatList({ isGettingChatList: true }));
      const { data, status } = yield axios.post(
        `${AWS_SERVER}/chat/chatListByUserId`,
        { userId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (status === 201 && data.code === CodeNumber.SUCCESS) {
        console.log('TCL: .takeEvery -> data.data', data.data);
        yield put(setIsGettingChatList({ isGettingChatList: false }));
        yield put(getChatListSync({ chatList: data.data, userId }));
      } else {
        console.log('TCL: .takeEvery -> status', status);
        console.log('get chatListByCombinedId no ok', data);
        yield put(setIsGettingChatList({ isGettingChatList: false }));
      }
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingChatList({ isGettingChatList: false }));
    }
  })
  .takeEvery(sendMsgAsync, function*(
    { from, to, text, combinedId, position, createdAt, isRead },
    { select, put },
  ) {
    console.log(`sendMsgAsync`);
    console.log(AWS_SERVER);
    yield socket.emit('sendMsgAsync', { from, to, text, combinedId, position, createdAt, isRead });
  })
  .takeEvery(receiveMsgAsync, function*({ dispatch }, { select, put }) {
    try {
      yield socket.on('receiveMsgAsync', (data: ChatDto) => {
        dispatch(receiveMsgSync({ newChat: data }));
      });
    } catch (error) {
      console.error(error.response);
    }
  })
  .takeEvery(readMsgAsync, function*({ from, to, dispatch }, { select, put }) {
    try {
      const accessToken = yield localStorage.getItem('access_token');
      const { data, status } = yield axios.put(
        `${AWS_SERVER}/chat/readMsgAsync`,
        { from, to },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('TCL: .takeEvery -> status', status);
      console.log('TCL: .takeEvery -> data', data);
    } catch (error) {
      console.error(error.response);
    }
  });

export default chatBuilder.build();
