import React, { memo, useEffect, useCallback, useState } from 'react';

import { connect } from 'dva';
import { router } from 'umi';
import { NavBar, Icon, Button, List, InputItem } from 'antd-mobile';
import { MessageBox, ChatItem, ChatList } from 'react-chat-elements';

import { getTargetUserByIdAsync, sendMsgAsync } from '@/actions/chatActions';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import { IGenius } from '../../interfaces/index';
import './chat.less';
import Auth from '@/components/Auth';

const mapStateToProps = ({ chat, auth }: IGlobalState) => ({
  chat,
  auth,
});

type ChatStateProps = ReturnType<typeof mapStateToProps>;

interface IChatProps extends IUmiComponent, ChatStateProps {}

const Chat: React.FunctionComponent<IChatProps> = ({ computedMatch, dispatch, chat, auth }) => {
  const { targetUser } = chat;
  const { userId } = auth;
  // text
  const [text, setText] = useState<string>('');
  console.log('TCL: text', text);
  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
    },
    [text],
  );

  // ws
  // useEffect(() => {
  //   const socket = io(`ws://localhost:9093`);
  //   socket.emit(`sendMsg`, 20);
  //   socket.on(`sendMsg`, (data: number) => {
  //     console.log('TCL: data', data);
  //   });
  // }, []);
  // getTargetUserByIdAsync
  useEffect(() => {
    if (computedMatch) {
      console.log('TCL: computedMatch', computedMatch.params.id);
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
    console.log('TCL: handleSendClicked -> to', to);
    const from = userId;
    console.log('TCL: handleSendClicked -> from', from);
    console.log('TCL: handleSendClicked -> text', text);
    if (from && to && text) {
      dispatch(sendMsgAsync({ from, to, text }));
    }
  }, [text, targetUser]);

  return (
    <div>
      <Auth dispatch={dispatch} />
      <NavBar leftContent={[renderLeftIcon()]} mode="dark">
        {targetUser && targetUser.email.split('@')[0]}
      </NavBar>
      <List className={`chat-input`}>
        <InputItem
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
