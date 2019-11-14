import { Toast } from 'antd-mobile';
import router from 'umi/router';
import axios from 'axios';

axios.interceptors.request.use(
  req => {
    Toast.loading('loading', 0);
    return req;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  res => {
    if (res.data == null) return Promise.resolve(res);
    Toast.hide();
    return res;
  },
  error => {
    if (error.response.status === 401) {
      console.log('TCL: error', error.response);
      Toast.hide();
      router.push(`/auth/login`);
    }
    if (error.response.status === 400) {
      console.log('TCL: error', error.response);
      Toast.hide();
      router.push(`/auth/login`);
    }
    if (error.response.status === 404) {
      console.log('TCL: error', error.response);
      Toast.hide();
      router.push(`/auth/login`);
    }
    if (error.response.status === 500) {
      console.log('TCL: error', error.response);
      Toast.fail(`Internal server error`);
      router.push(`/auth/login`);
    }
    if (error.response.status === 504) {
      console.log('TCL: error', error.response);
      Toast.fail(`gateway timeout`);
      router.push(`/auth/login`);
    }
    return Promise.reject(error);
  },
);
