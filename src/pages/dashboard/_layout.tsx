import React, { memo, Fragment, useEffect } from 'react';
import Auth from '@/components/Auth';
import { router } from 'umi';
import { connect } from 'dva';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import { NavBar, TabBar, WhiteSpace } from 'antd-mobile';
import { Kind } from '@/enum';
import { receiveMsgAsync, getToIdChatListAsync } from '@/actions/chatActions';
import './dashboard.less';
const mapStateToProps = ({ auth, chat }: IGlobalState) => ({
  auth,
  chat,
});
type DashboardStateProps = ReturnType<typeof mapStateToProps>;
interface IDashboardProps extends IUmiComponent, DashboardStateProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = ({
  children,
  dispatch,
  auth,
  location,
  chat,
}) => {
  const pathname = location.pathname;
  const { kind, userId } = auth;
  const { unread } = chat;
  const navList = [
    {
      path: '/dashboard/boss',
      text: 'genius',
      icon: 'boss',
      title: 'Genius List',
      hide: kind === Kind.GENIUS,
    },
    {
      path: '/dashboard/genius',
      text: 'boss',
      icon: 'job',
      title: 'Boss List',
      hide: kind === Kind.BOSS,
    },
    {
      path: '/dashboard/message',
      text: 'message',
      icon: 'msg',
      title: 'Message List',
    },
    {
      path: '/dashboard/me',
      text: 'me',
      icon: 'user',
      title: 'Personal Information',
    },
  ];

  type NavList = typeof navList[number];
  const getTitle = (navList: NavList[]): string | null => {
    const matchedNav = navList.find(nav => {
      if (nav.path === pathname) {
        return nav;
      }
    });
    if (matchedNav) {
      return matchedNav.title;
    } else {
      return null;
    }
  };
  const renderFooter = (navList: NavList[]) => {
    const filteredNavList = navList.filter(nav => !nav.hide);
    return filteredNavList.map(nav => {
      return (
        <TabBar.Item
          badge={nav.path === `/dashboard/message` ? unread : 0}
          icon={{
            uri: require(`@/images/${nav.icon}.png`),
          }}
          selectedIcon={{ uri: require(`../../images/${nav.icon}-active.png`) }}
          selected={nav.path === pathname}
          title={nav.text}
          key={nav.text}
          onPress={() => {
            router.push(nav.path);
          }}
        />
      );
    });
  };

  // getToIdChatListAsync
  useEffect(() => {
    if (userId) {
      dispatch(getToIdChatListAsync({ toId: userId }));
    }
  }, [userId]);

  // receiveMsgAsync
  useEffect(() => {
    console.log('TCL: receiveMsgAsync in boss');
    dispatch(receiveMsgAsync({ dispatch }));
  });

  return (
    <Fragment>
      <Auth dispatch={dispatch} />
      <NavBar mode="dark">{getTitle(navList)}</NavBar>
      <WhiteSpace />
      <div className={`dashboard-content`}>{children}</div>
      <TabBar
        tabBarPosition={'bottom'}
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        {renderFooter(navList)}
      </TabBar>
    </Fragment>
  );
};

export default memo(connect(mapStateToProps)(Dashboard));
