import React, { memo, useEffect } from 'react';
import { connect } from 'dva';
import { IUmiComponent } from '@/interfaces';
import io from 'socket.io-client';
interface IChatProps extends IUmiComponent {}

const Chat: React.FunctionComponent<IChatProps> = ({ computedMatch }) => {
  useEffect(() => {
    const socket = io(`ws://localhost:9093`);
    socket.emit(`sendMsg`, 20);
    socket.on(`sendMsg`, (data: number) => {
      console.log('TCL: data', data);
    });
  }, []);
  if (computedMatch) {
    console.log('TCL: computedMatch', computedMatch.params.id);
  }
  return <div>Chat</div>;
};

export default memo(connect()(Chat));
