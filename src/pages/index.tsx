/**
 * title: Index Page
 */
import React, { useEffect } from 'react';
import axios from 'axios';

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = props => {
  useEffect(() => {
    axios
      .post(`/api/auth/signup`, { email: `Pop@gmail.com`, password: '12345678' })
      .then(res => {
        console.log('TCL: res', res);
      })
      .catch(error => {
        console.error(error);
      });
    return () => {};
  }, []);
  return <div>hello Manu</div>;
};

export default App;
