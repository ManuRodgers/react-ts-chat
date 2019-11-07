import React, { memo, useCallback } from 'react';
import { router } from 'umi';
import { connect } from 'dva';
import { Result, List, WhiteSpace, Button } from 'antd-mobile';
import { logoutCurrentUserInfoSync } from '@/actions/authActions';
import { logoutBossInfoSync } from '@/actions/bossActions';
import { logoutGeniusInfoSync } from '@/actions/geniusActions';

import { IUmiComponent, IGlobalState } from '../../interfaces/index';
import Auth from '../../components/Auth';
import { Kind } from '@/enum';

const mapStateToProps = ({ boss, auth, genius }: IGlobalState) => ({
  boss,
  auth,
  genius,
});
type MeStateProps = ReturnType<typeof mapStateToProps>;

interface IMeProps extends IUmiComponent, MeStateProps {}

const Me: React.FunctionComponent<IMeProps> = ({ dispatch, boss, auth, genius }) => {
  const { kind, email } = auth;
  let avatar = '';
  if (kind === Kind.BOSS && boss.avatar) {
    avatar = boss.avatar;
  }
  if (kind === Kind.GENIUS && genius.avatar) {
    avatar = genius.avatar;
  }

  const handleUpdateUser: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    localStorage.setItem('updatingUser', `1`);
    if (kind === Kind.BOSS) {
      router.push(`/bossInfo`);
    } else {
      router.push(`/geniusInfo`);
    }
  }, []);
  const handleLogoutUser: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    localStorage.removeItem('access_token');
    dispatch(logoutCurrentUserInfoSync({}));
    if (kind === Kind.BOSS) {
      dispatch(logoutBossInfoSync({}));
    }
    if (kind === Kind.GENIUS) {
      dispatch(logoutGeniusInfoSync({}));
    }
    router.push('/auth/login');
  }, []);

  return (
    <div>
      <Auth dispatch={dispatch} />
      <Result
        img={<img width={50} src={avatar && require(`@/images/${avatar}.png`)} alt={avatar} />}
        title={`username: ` + (email && email.split(`@`)[0])}
        message={
          kind === Kind.BOSS
            ? 'Title: ' + (boss.title && boss.title)
            : 'Title: ' + (genius.job && genius.job)
        }
      />
      <List renderHeader={`Your Basic Information`}>
        <List.Item multipleLine={true} wrap={true}>
          Description:
          {kind === Kind.BOSS
            ? boss.description && boss.description
            : genius.profile && genius.profile}
          <List.Item.Brief wrap={true}>
            Salary: {kind === Kind.BOSS ? boss.money && boss.money : genius.salary && genius.salary}
          </List.Item.Brief>
          <List.Item.Brief wrap={true}>
            {kind === Kind.BOSS ? `Company:` + (boss.company && boss.company) : null}
          </List.Item.Brief>
        </List.Item>
      </List>
      <WhiteSpace size={`sm`} />
      <Button onClick={handleLogoutUser} type={'primary'}>
        Logout
      </Button>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Me));
