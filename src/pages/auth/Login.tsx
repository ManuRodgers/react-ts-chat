import React, { memo, useState, useCallback, ReactNode } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { WhiteSpace, WingBlank, List, InputItem, Flex, Button, NoticeBar } from 'antd-mobile';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import Logo from './components/Logo';
import './auth.less';
import { loginAsync } from '@/actions/authActions';

const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type LoginStateProps = ReturnType<typeof mapStateToProps>;

interface ILoginProps extends IUmiComponent, LoginStateProps {}

const Login: React.FunctionComponent<ILoginProps> = ({ auth, dispatch }) => {
  const { errorMsg, successMsg } = auth;
  const [email, setEmail] = useState<string>('');
  const handleEmailChange = useCallback(
    (value: string): void => {
      setEmail(value);
    },
    [email],
  );
  const [password, setPassword] = useState<string>('');
  const handlePasswordChange = useCallback(
    (value: string): void => {
      setPassword(value);
    },
    [password],
  );

  const goRegister: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    router.push(`/auth/register`);
  }, []);

  const forLogin: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    dispatch(loginAsync({ email, password }));
  }, [email, password]);
  // TODO:
  const generateErrorMsg = (errorMsg: string = ''): ReactNode | null => {
    return errorMsg === '' ? null : <NoticeBar mode={'closable'}>{errorMsg}</NoticeBar>;
  };
  const generateSuccessMsg = (successMsg: string = ''): ReactNode | null => {
    return successMsg === '' ? null : <NoticeBar mode={'closable'}>{successMsg}</NoticeBar>;
  };
  return (
    <Flex className="login" direction={`column`}>
      <Flex.Item flex={1}>
        <Logo />
      </Flex.Item>
      {generateErrorMsg(errorMsg)}
      {generateSuccessMsg(successMsg)}
      <Flex.Item style={{ width: '90%' }}>
        <List>
          <InputItem
            name={`email`}
            clear={true}
            value={email}
            onChange={handleEmailChange}
            placeholder={`Enter email`}
          >
            Email:
          </InputItem>
          <WhiteSpace />
          <InputItem
            type={'password'}
            name={`password`}
            value={password}
            onChange={handlePasswordChange}
            clear={true}
            placeholder={`Enter password`}
          >
            Password:
          </InputItem>
          <WhiteSpace />
        </List>
        <Button onClick={forLogin} type={'primary'}>
          Login
        </Button>
        <WhiteSpace />
        <Button onClick={goRegister} type={'primary'}>
          Register
        </Button>
      </Flex.Item>
    </Flex>
  );
};

export default memo(connect(mapStateToProps)(Login));
