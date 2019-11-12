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
  getCombinedIdChatListSync,
  getCombinedIdChatListAsync,
  setIsGettingCombinedIdChatList,
} from '@/actions/chatActions';

import { IGlobalState, IGenius } from '@/interfaces';
import { CodeNumber, Kind, Position } from '@/enum';
import { IBoss } from '../interfaces/index';
import { ChatDto } from '@/dto/chat.dto';

const socketURL = process.env.SOCKETIO_URL || `ws://localhost:9093`;
const socket = io(socketURL);

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
  targetUser: undefined,
  isGettingTargetUser: false,
  isGettingCombinedIdChatList: false,
};
const chatBuilder = new DvaModelBuilder(initState, 'chat')
  .case(getTargetUserByIdSync, (state, { targetUser }) => ({ ...state, targetUser }))
  .case(getCombinedIdChatListSync, (state, { combinedIdChatList }) => ({
    ...state,
    combinedIdChatList,
  }))
  .case(sendMsgSync, (state, { combinedId, createdAt, from, position, text, to, isRead }) => ({
    ...state,
    currentChat: { combinedId, createdAt, from, position, text, to, isRead },
  }))
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
        `/api/user/targetUser/${id}`,

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
      console.log('TCL: .takeEvery -> combinedId', combinedId);
      const accessToken = yield localStorage.getItem('access_token');
      const isGettingCombinedIdChatList = yield select(
        (state: IGlobalState) => state.chat.isGettingCombinedIdChatList,
      );
      if (isGettingCombinedIdChatList) {
        return;
      }
      yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: true }));
      const { data, status } = yield axios.post(
        `/api/chat/chatListByCombinedId`,
        { combinedId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('TCL: data', data);
      console.log('TCL: status', status);
    } catch (error) {
      console.error(error.response);
      yield put(setIsGettingCombinedIdChatList({ isGettingCombinedIdChatList: false }));
    }
  })
  .takeEvery(sendMsgAsync, function*(
    { from, to, text, combinedId, position, createdAt, isRead },
    { select, put },
  ) {
    yield socket.emit('sendMsgAsync', { from, to, text, combinedId, position, createdAt, isRead });
  })
  .takeEvery(receiveMsgAsync, function*({}, { select, put }) {
    yield socket.on('receiveMsgAsync', (data: ChatDto) => {
      console.log('TCL: .takeEvery -> data', data);
    });
  });

export default chatBuilder.build();
