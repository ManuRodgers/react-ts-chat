import React, { memo, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { List, Badge } from 'antd-mobile';

import { IUmiComponent, IGlobalState } from '../../interfaces/index';
import {
  getChatListAsync,
  receiveMsgAsync,
  getToIdChatListAsync,
  getTargetUserByIdAsync,
} from '@/actions/chatActions';
import { getGeniusListAsync } from '@/actions/bossActions';
import { getBossListAsync } from '@/actions/geniusActions';
import Auth from '../../components/Auth';
import { Kind } from '@/enum';
import { ChatDto } from '@/dto/chat.dto';
import router from 'umi/router';

const mapStateToProps = ({ auth, chat, boss, genius }: IGlobalState) => ({
  auth,
  chat,
  boss,
  genius,
});
type MessageStateProps = ReturnType<typeof mapStateToProps>;

interface IMessageProps extends IUmiComponent, MessageStateProps {}

const Message: React.FunctionComponent<IMessageProps> = ({
  dispatch,
  auth,
  chat,
  boss,
  genius,
}) => {
  const { userId, kind } = auth;
  const { chatList, toIdChatList } = chat;
  const { geniusList } = boss;
  console.log('TCL: geniusList', geniusList);
  const { bossList } = genius;
  // getChatListAsync
  useEffect(() => {
    console.log('TCL: chatList.length', chatList.length);
    if (userId) {
      console.log('TCL: userId', userId);
      dispatch(getChatListAsync({ userId }));
    }
  }, [userId]);
  // getBossListAsync
  useEffect(() => {
    if (bossList.length === 0 && kind === Kind.GENIUS) {
      console.log('TCL: getBossListAsync');
      dispatch(getBossListAsync({}));
    }
  });
  // getGeniusListAsync
  useEffect(() => {
    if (geniusList.length === 0 && kind === Kind.BOSS) {
      console.log('TCL: getGeniusListAsync');
      dispatch(getGeniusListAsync({}));
    }
  });

  // make chat group based on combinedId
  // TODO:
  let chatGroup = {};
  if (chatList.length > 0) {
    chatList.forEach(chat => {
      chatGroup[chat.combinedId] = chatGroup[chat.combinedId] || [];
      chatGroup[chat.combinedId].push(chat);
    });
  }
  console.log('TCL: chatGroup', chatGroup);

  let toChatGroup = {};
  if (toIdChatList.length > 0) {
    toIdChatList.forEach(toChat => {
      toChatGroup[toChat.combinedId] = toChatGroup[toChat.combinedId] || [];
      toChatGroup[toChat.combinedId].push(toChat);
    });
  }
  console.log('TCL: toChatGroup', toChatGroup);
  // receiveMsgAsync
  useEffect(() => {
    dispatch(receiveMsgAsync({ dispatch }));
  });

  const renderGeniusList = useCallback(() => {
    return (
      geniusList &&
      geniusList
        .sort((a, b) => {
          const aCombinedId = [a.id, userId].sort().join('_');
          const bCombinedId = [b.id, userId].sort().join('_');
          const aCreatedAt =
            chatGroup[aCombinedId] &&
            chatGroup[aCombinedId][chatGroup[aCombinedId].length - 1].createdAt;
          console.log('TCL: renderGeniusList -> aCreatedAt', aCreatedAt);
          const bCreatedAt =
            chatGroup[bCombinedId] &&
            chatGroup[bCombinedId][chatGroup[bCombinedId].length - 1].createdAt;
          console.log('TCL: renderGeniusList -> bCreatedAt', bCreatedAt);
          if (bCreatedAt === undefined) {
            console.log(`hello`);
            return;
          }
          return bCreatedAt - aCreatedAt;
        })
        .map(genius => {
          const combinedId = [genius.id, userId].sort().join('_');
          const unreadNum =
            toChatGroup[combinedId] &&
            toChatGroup[combinedId].filter((toChat: ChatDto) => !toChat.isRead).length;
          return (
            <List.Item
              key={genius.id}
              extra={<Badge text={unreadNum} />}
              arrow="horizontal"
              thumb={<img src={require(`@/images/${genius.avatar}.png`)} />}
              multipleLine={true}
              onClick={() => {
                dispatch(getTargetUserByIdAsync({ id: genius.id }));
                router.push(`/chat/${genius.id}`);
              }}
            >
              {genius.email.split('@')[0]}{' '}
              <List.Item.Brief>
                {chatGroup[combinedId] &&
                  chatGroup[combinedId][chatGroup[combinedId].length - 1].text}
              </List.Item.Brief>
            </List.Item>
          );
        })
    );
  }, [geniusList, chatGroup, toChatGroup]);

  const renderBossList = useCallback(() => {
    return (
      bossList &&
      bossList
        .sort((a, b) => {
          const aCombinedId = [a.id, userId].sort().join('_');
          const bCombinedId = [b.id, userId].sort().join('_');
          const aCreatedAt =
            chatGroup[aCombinedId] &&
            chatGroup[aCombinedId][chatGroup[aCombinedId].length - 1].createdAt;
          const bCreatedAt =
            chatGroup[bCombinedId] &&
            chatGroup[bCombinedId][chatGroup[bCombinedId].length - 1].createdAt;

          return bCreatedAt - aCreatedAt;
        })
        .map(boss => {
          const combinedId = [boss.id, userId].sort().join('_');
          const unreadNum =
            toChatGroup[combinedId] &&
            toChatGroup[combinedId].filter((toChat: ChatDto) => !toChat.isRead).length;
          return (
            <List.Item
              extra={<Badge text={unreadNum} />}
              key={boss.id}
              arrow="horizontal"
              thumb={<img src={require(`@/images/${boss.avatar}.png`)} />}
              multipleLine={true}
              onClick={() => {
                dispatch(getTargetUserByIdAsync({ id: boss.id }));
                router.push(`/chat/${boss.id}`);
              }}
            >
              {boss.email.split('@')[0]}{' '}
              <List.Item.Brief>
                {chatGroup[combinedId] &&
                  chatGroup[combinedId][chatGroup[combinedId].length - 1].text}
              </List.Item.Brief>
            </List.Item>
          );
        })
    );
  }, [bossList, chatGroup, toChatGroup]);
  return (
    <div>
      <Auth dispatch={dispatch} />
      <List className="user-list">
        {kind === Kind.BOSS ? renderGeniusList() : renderBossList()}
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Message));
