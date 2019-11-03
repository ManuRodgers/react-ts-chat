import React, { useState, useCallback, memo, ReactNode } from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, InputItem, Flex, Radio, Button, NoticeBar } from 'antd-mobile';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import Logo from './components/Logo';
import { Kind } from '@/enum';
import { registerAsync, setErrorMsg } from '../../actions/authActions';
import { router } from 'umi';
const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type RegisterStateProps = ReturnType<typeof mapStateToProps>;

interface IRegisterProps extends IUmiComponent, RegisterStateProps {}
const Register: React.FunctionComponent<IRegisterProps> = ({ dispatch, auth }) => {
  const { errorMsg } = auth;
  // email
  const [email, setEmail] = useState<string>('');
  const handleEmailChange = useCallback(
    (value: string): void => {
      setEmail(value);
    },
    [email],
  );
  // password
  const [password, setPassword] = useState<string>('');
  const handlePasswordChange = useCallback(
    (value: string): void => {
      setPassword(value);
    },
    [password],
  );
  // confirm
  const [confirm, setConfirm] = useState<string>('');
  const handleConfirmChange = useCallback(
    (value: string): void => {
      setConfirm(value);
    },
    [confirm],
  );
  // kind
  const [kind, setKind] = useState<Kind>(Kind.GENIUS);

  const handleKindChange = useCallback(
    (value: Kind): void => {
      setKind(value);
    },
    [kind],
  );
  const handleRegisterSubmitted: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    if (password !== confirm) {
      return dispatch(setErrorMsg({ errorMsg: 'password and confirm are not exactly the same' }));
    }
    dispatch(registerAsync({ email, password, kind }));
  }, [email, password, confirm, kind]);

  const goLogin: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    router.push(`/auth/login`);
  }, []);
  const generateErrorMsg = (errorMsg: string = ''): ReactNode | null => {
    return errorMsg === '' ? null : (
      <NoticeBar icon={null} mode="closable">
        <span style={{ color: 'red', fontSize: '10px' }}>{errorMsg}</span>
      </NoticeBar>
    );
  };
  return (
    <Flex direction={'column'} className={`register`}>
      <Flex.Item>
        <Logo />
      </Flex.Item>
      {generateErrorMsg(errorMsg)}
      <WhiteSpace />
      <Flex.Item style={{ width: '100%' }}>
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
          <InputItem
            type={'password'}
            name={`confirm`}
            value={confirm}
            onChange={handleConfirmChange}
            clear={true}
            placeholder={`Enter confirm`}
          >
            Confirm:
          </InputItem>
          <WhiteSpace />
          <Radio.RadioItem
            name={`kind`}
            onChange={() => {
              handleKindChange(Kind.GENIUS);
            }}
            checked={kind === Kind.GENIUS}
          >
            Genius
          </Radio.RadioItem>
          <WhiteSpace />
          <Radio.RadioItem
            name={`kind`}
            onChange={() => {
              handleKindChange(Kind.BOSS);
            }}
            checked={kind === Kind.BOSS}
          >
            Boss
          </Radio.RadioItem>
          <WhiteSpace />
          <Button onClick={handleRegisterSubmitted} type={'primary'}>
            Register
          </Button>
          <WhiteSpace />
          <Button onClick={goLogin} type={'primary'}>
            Back To Login
          </Button>
        </List>
      </Flex.Item>
    </Flex>
  );
};

export default memo(connect(mapStateToProps)(Register));
