import { Toast } from 'antd-mobile';
import router from 'umi/router';
import axios from 'axios';

axios.interceptors.request.use(req => {
  Toast.loading('loading', 0);
  return req;
});

axios.interceptors.response.use(
  res => {
    if (res.data == null) return Promise.resolve(res);
    Toast.hide();
    return res;
  },
  error => {
    if (error.response.status === 401) {
      Toast.fail(`Invalid credentials, Please Login Again`, 2);
      router.push(`/auth/login`);
    }
    if (error.response.status === 400) {
      console.log('TCL: error', error);
      Toast.fail(`Please enter correct form of credentials`, 2);
      router.push(`/auth/login`);
    }
    return error;
  },
);
