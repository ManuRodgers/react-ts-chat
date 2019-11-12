import React, { memo, useEffect, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { router } from 'umi';
import { NavBar, Icon, Button, List, InputItem } from 'antd-mobile';
import { MessageBox, ChatItem, ChatList } from 'react-chat-elements';

import {
  getTargetUserByIdAsync,
  sendMsgAsync,
  receiveMsgAsync,
  sendMsgSync,
  getCombinedIdChatListAsync,
} from '@/actions/chatActions';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import { IGenius } from '../../interfaces/index';
import './chat.less';
import Auth from '@/components/Auth';
import { Position } from '@/enum';

const mapStateToProps = ({ chat, auth }: IGlobalState) => ({
  chat,
  auth,
});

type ChatStateProps = ReturnType<typeof mapStateToProps>;

interface IChatProps extends IUmiComponent, ChatStateProps {}

const Chat: React.FunctionComponent<IChatProps> = ({ computedMatch, dispatch, chat, auth }) => {
  const { targetUser, chatList } = chat;
  const { userId } = auth;
  // text
  const [text, setText] = useState<string>('');
  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
    },
    [text],
  );

  useEffect(() => {
    if (computedMatch) {
      dispatch(getTargetUserByIdAsync({ id: computedMatch.params.id }));
    }
  }, []);

  // navbar left
  const handleLeftClicked: React.MouseEventHandler<SVGSVGElement> = useCallback(() => {
    router.goBack();
  }, []);
  const renderLeftIcon = () => {
    return <Icon onClick={handleLeftClicked} key="0" type="left" style={{ marginRight: '16px' }} />;
  };

  //
  const handleSendClicked: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    const to = targetUser && targetUser.id;
    const from = userId;
    if (from && to && text) {
      const combinedId = [from, to].sort().join('_');
      // timestamp in seconds
      const createdAt = Math.floor(Date.now() / 1000);
      dispatch(
        sendMsgAsync({
          from,
          to,
          text,
          combinedId,
          createdAt,
          position: Position.RIGHT,
          isRead: false,
        }),
      );
      dispatch(
        sendMsgSync({
          from,
          to,
          text,
          combinedId,
          createdAt,
          position: Position.RIGHT,
          isRead: false,
        }),
      );
      setText('');
    }
  }, [text, targetUser]);

  // getCombinedIdChatListAsync
  useEffect(() => {
    console.log(`chatListByCombinedId`);
    const to = targetUser && targetUser.id;
    const from = userId;
    if (from && to) {
      const combinedId = [from, to].sort().join('_');
      if (combinedId) {
        dispatch(getCombinedIdChatListAsync({ combinedId }));
      }
    }
  });

  // receiveMsgAsync
  useEffect(() => {
    dispatch(receiveMsgAsync({}));
  }, [chatList]);

  const handleEnterKeyDown: React.KeyboardEventHandler = useCallback(
    e => {
      if (e.keyCode === 13) {
        const to = targetUser && targetUser.id;
        const from = userId;
        if (from && to && text) {
          const combinedId = [from, to].sort().join('_');
          // timestamp in seconds
          const createdAt = Math.floor(Date.now() / 1000);
          dispatch(
            sendMsgAsync({
              from,
              to,
              text,
              combinedId,
              createdAt,
              position: Position.RIGHT,
              isRead: false,
            }),
          );
          dispatch(
            sendMsgSync({
              from,
              to,
              text,
              combinedId,
              createdAt,
              position: Position.RIGHT,
              isRead: false,
            }),
          );
          return setText('');
        }
      }
    },
    [text, targetUser],
  );

  return (
    <div>
      <Auth dispatch={dispatch} />
      <NavBar leftContent={[renderLeftIcon()]} mode="dark">
        {targetUser && targetUser.email.split('@')[0]}
      </NavBar>
      <List className={`chat-input`}>
        <InputItem
          onKeyDown={handleEnterKeyDown}
          value={text}
          onChange={handleTextChange}
          placeholder={`Type here ...`}
          extra={<span style={{ fontSize: 18 }}>Send</span>}
          onExtraClick={handleSendClicked}
        />
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Chat));
