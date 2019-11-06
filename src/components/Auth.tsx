import React, { useEffect, memo } from 'react';
import { getCurrentUserInfoAsync } from '@/actions/authActions';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { IUmiComponent } from '@/interfaces';

interface IAuthProps extends IUmiComponent {}

export default memo(
  withRouter<IAuthProps, React.ComponentType<IAuthProps>>(({ dispatch, location }) => {
    useEffect(() => {
      const publicList = ['/auth/login', '/auth/register'];
      if (publicList.indexOf(location.pathname) > -1) {
        return;
      }
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        dispatch(getCurrentUserInfoAsync({ accessToken }));
      } else {
        router.push(`/auth/login`);
      }
    }, []);
    return null;
  }),
);
