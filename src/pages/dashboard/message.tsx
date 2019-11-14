import React, { memo, useEffect } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';

import { IUmiComponent, IGlobalState } from '../../interfaces/index';
import { getChatListAsync, receiveMsgAsync } from '@/actions/chatActions';
import { getGeniusListAsync } from '@/actions/bossActions';
import { getBossListAsync } from '@/actions/geniusActions';
import Auth from '../../components/Auth';
import { Kind } from '@/enum';
import { IGenius } from '@/interfaces';

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
  console.log('TCL: kind', kind);
  const { chatList } = chat;
  const { geniusList } = boss;
  const { bossList } = genius;
  // getChatListAsync
  useEffect(() => {
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
  // receiveMsgAsync
  useEffect(() => {
    dispatch(receiveMsgAsync({ dispatch }));
  });
  return (
    <div>
      <Auth dispatch={dispatch} />
      <List className="user-list">
        {geniusList &&
          geniusList.map(genius => {
            const combinedId = [genius.id, userId].sort().join('_');
            console.log('TCL: chatGroup[combinedId]', chatGroup[combinedId]);
            return (
              <List.Item
                key={genius.id}
                arrow="horizontal"
                thumb={<img src={require(`@/images/${genius.avatar}.png`)} />}
                multipleLine={true}
                onClick={() => {}}
              >
                {genius.email.split('@')[0]}{' '}
                <List.Item.Brief>
                  {chatGroup[combinedId][chatGroup[combinedId].length - 1].text}
                </List.Item.Brief>
              </List.Item>
            );
          })}
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Message));
