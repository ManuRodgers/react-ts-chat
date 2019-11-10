import { DvaModelBuilder } from 'dva-model-creator';
import axios, { AxiosResponse } from 'axios';
import io from 'socket.io-client';
import { router } from 'umi';

import {
  getTargetUserByIdSync,
  getTargetUserByIdAsync,
  setIsGettingTargetUser,
  sendMsgAsync,
} from '@/actions/chatActions';

import { IGlobalState, IGenius } from '@/interfaces';
import { CodeNumber, Kind } from '@/enum';
import { IBoss } from '../interfaces/index';

const socket = io(`ws://localhost:9093`);

const initState: IGlobalState['chat'] = {
  chatList: [],
  targetUser: undefined,
  isGettingTargetUser: false,
};
const chatBuilder = new DvaModelBuilder(initState, 'chat')
  .case(getTargetUserByIdSync, (state, { targetUser }) => ({ ...state, targetUser }))
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
  .takeEvery(sendMsgAsync, function*({ from, to, text }, { select, put }) {
    yield socket.emit('sendMsg', { from, to, text });
  });

export default chatBuilder.build();
