import React, { memo, useEffect, useCallback, useState } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Picker, Emoji, EmojiData } from 'emoji-mart';
import { NavBar, Icon, Button, List, InputItem } from 'antd-mobile';

import {
  getTargetUserByIdAsync,
  sendMsgAsync,
  receiveMsgAsync,
  getCombinedIdChatListAsync,
  getTargetUserByIdSync,
  readMsgAsync,
} from '@/actions/chatActions';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import './chat.less';
import Auth from '@/components/Auth';
import { Position, Kind } from '@/enum';
import { ChatDto } from '@/dto/chat.dto';

const mapStateToProps = ({ chat, auth, boss, genius }: IGlobalState) => ({
  chat,
  auth,
  boss,
  genius,
});

type ChatStateProps = ReturnType<typeof mapStateToProps>;

interface IChatProps extends IUmiComponent, ChatStateProps {}

const Chat: React.FunctionComponent<IChatProps> = ({
  computedMatch,
  dispatch,
  chat,
  auth,
  boss,
  genius,
}) => {
  const { targetUser, combinedIdChatList } = chat;
  const { userId, kind } = auth;
  const to = targetUser && targetUser.id;
  const from = userId;
  const avatar = targetUser && targetUser.avatar;
  let currentAvatar = '';
  if (kind === Kind.BOSS) {
    currentAvatar = boss.avatar;
  } else {
    currentAvatar = genius.avatar;
  }
  // text
  const [text, setText] = useState<string>('');
  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
    },
    [text],
  );
  // getTargetUserByIdAsync
  useEffect(() => {
    if (computedMatch) {
      dispatch(getTargetUserByIdAsync({ id: computedMatch.params.id }));
    }
  }, []);

  // navbar left
  const handleLeftClicked: React.MouseEventHandler<SVGSVGElement> = useCallback(() => {
    if (to) {
      dispatch(readMsgAsync({ dispatch, from: to, to: userId }));
    }
    dispatch(getTargetUserByIdSync({ targetUser: undefined }));
    router.goBack();
  }, [to]);
  const renderLeftIcon = () => {
    return <Icon onClick={handleLeftClicked} key="0" type="left" style={{ marginRight: '16px' }} />;
  };

  // handleSendClicked
  const handleSendClicked: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
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
      setShowEmoji(false);
      setText('');
    }
  }, [text, to]);

  // getCombinedIdChatListAsync
  useEffect(() => {
    console.log(`chatListByCombinedId`);
    if (from && to) {
      const combinedId = [from, to].sort().join('_');
      if (combinedId) {
        dispatch(getCombinedIdChatListAsync({ combinedId }));
      }
    }
  }, [to, from]);

  // receiveMsgAsync
  useEffect(() => {
    dispatch(receiveMsgAsync({ dispatch }));
  }, [combinedIdChatList]);

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
          setShowEmoji(false);
          return setText('');
        }
      }
    },
    [text, targetUser],
  );
  //  renderChatList
  const renderChatList = useCallback(
    (combinedIdChatList: ChatDto[]) => {
      if (to) {
        return (
          combinedIdChatList &&
          combinedIdChatList.map((chat: ChatDto) => {
            return to === chat.from ? (
              <List key={chat.createdAt}>
                <List.Item thumb={<img src={require(`@/images/${currentAvatar}.png`)} />}>
                  {chat.text}
                </List.Item>
              </List>
            ) : (
              <List key={chat.createdAt}>
                <List.Item
                  extra={<img src={require(`@/images/${avatar}.png`)} />}
                  className={`chat-me`}
                >
                  {chat.text}
                </List.Item>
              </List>
            );
          })
        );
      }
    },
    [combinedIdChatList],
  );

  // emoji
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const onEmojiClicked = useCallback(() => {
    setShowEmoji(showEmoji => !showEmoji);
  }, []);
  const renderExtra = useCallback(() => {
    return (
      <div>
        <span onClick={handleSendClicked} style={{ fontSize: 18, marginRight: 12 }}>
          Send
        </span>
        <Emoji onClick={onEmojiClicked} emoji={`smiley`} size={20} tooltip={true} />
      </div>
    );
  }, []);

  const onEmojiSelected = useCallback((emoji: EmojiData) => {
    // @ts-ignore
    console.log('TCL: onEmojiSelected -> emoji', emoji.native);
    setText(text => {
      // @ts-ignore
      return `${text}${emoji.native}`;
    });
  }, []);

  const renderEmoji = useCallback(() => {
    return showEmoji ? (
      <Picker
        set={`facebook`}
        title="Pick your emoji…"
        emoji="point_up"
        style={{ position: 'absolute', bottom: `calc(12vw)`, right: '20px' }}
        onSelect={onEmojiSelected}
      />
    ) : null;
  }, [showEmoji]);

  return (
    <div id={`chat-page`}>
      <Auth dispatch={dispatch} />
      <NavBar leftContent={[renderLeftIcon()]} mode="dark">
        {targetUser && targetUser.email.split('@')[0]}
      </NavBar>
      <div className={`chat-list`}>{renderChatList(combinedIdChatList)}</div>
      <List className={`chat-input`}>
        <InputItem
          onKeyDown={handleEnterKeyDown}
          value={text}
          onChange={handleTextChange}
          placeholder={`Type here ...`}
          extra={renderExtra()}
        />
        {renderEmoji()}
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Chat));
