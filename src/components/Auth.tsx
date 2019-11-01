import React, { useEffect, memo } from 'react';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface IAuthProps {}

export default memo(
  withRouter(({ location }) => {
    useEffect(() => {
      const publicList = ['/auth/login', '/auth/register'];
      if (publicList.indexOf(location.pathname) > -1) {
        return;
      }
      const accessToken = localStorage.getItem('access_token');
      axios
        .get(`api/user/info`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
          const { data, status } = res;
          if (status === 200) {
            if (data.code === 0) {
              console.log('with accessToken', data);
              // with accessToken
            } else {
              // without accessToken
              console.log('without accessToken', data);
              router.push('/auth/login');
            }
          }
        })
        .catch((error: AxiosError) => {
          console.error(error);
        });

      // return () => {};
    }, []);
    return null;
  }),
);
