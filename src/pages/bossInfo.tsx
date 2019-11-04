import React, { memo, useState, useCallback, ReactNode } from 'react';
import { connect } from 'dva';
import { NavBar, List, InputItem, WhiteSpace, TextareaItem, Button, NoticeBar } from 'antd-mobile';

import Auth from '@/components/Auth';
import { IUmiComponent, IGlobalState } from '@/interfaces';
import AvatarSelector from '@/components/AvatarSelector';
import { bossInfoAsync } from '@/actions/authActions';

const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type BossInfoStateProps = ReturnType<typeof mapStateToProps>;
interface IBossInfoProps extends IUmiComponent, BossInfoStateProps {}
const BossInfo: React.FunctionComponent<IBossInfoProps> = ({ dispatch, auth }) => {
  const { errorMsg } = auth;
  const [avatar, setAvatar] = useState<string>('');
  // title
  const [title, setTitle] = useState<string>('');
  const handleTitleChange = useCallback(
    title => {
      setTitle(title);
    },
    [title],
  );
  // company
  const [company, setCompany] = useState<string>('');
  const handleCompanyChange = useCallback(
    company => {
      setCompany(company);
    },
    [company],
  );
  // money
  const [money, setMoney] = useState<string>('');
  const handleMoneyChange = useCallback(
    money => {
      setMoney(money);
    },
    [money],
  );
  // description
  const [description, setDescription] = useState<string>('');
  const handleDescriptionChange = useCallback(
    description => {
      setDescription(description);
    },
    [description],
  );

  const getSelectedAvatarName = useCallback(
    (value: string): string => {
      setAvatar(value);
      return value;
    },
    [avatar],
  );

  const handleBossInfoSaveClicked: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    dispatch(bossInfoAsync({ avatar, title, company, money, description }));
  }, [avatar, title, company, money, description]);

  const generateErrorMsg = (errorMsg: string = ''): ReactNode | null => {
    return errorMsg === '' ? null : (
      <NoticeBar icon={null} mode="closable">
        <span style={{ color: 'red', fontSize: '10px' }}>{errorMsg}</span>
      </NoticeBar>
    );
  };

  return (
    <div>
      <Auth dispatch={dispatch} />
      <NavBar mode="dark">Complete Boss Information</NavBar>
      {generateErrorMsg(errorMsg)}
      <AvatarSelector getSelectedAvatarName={getSelectedAvatarName} />
      <WhiteSpace />
      <List renderHeader={`Please enter your basic information`}>
        <InputItem value={title} onChange={handleTitleChange}>
          Title:
        </InputItem>
        <InputItem value={company} onChange={handleCompanyChange}>
          Company:
        </InputItem>
        <InputItem value={money} onChange={handleMoneyChange}>
          Money:
        </InputItem>
        <TextareaItem
          rows={3}
          count={144}
          clear={true}
          title={`description`}
          placeholder={`Please enter job description`}
          value={description}
          onChange={handleDescriptionChange}
        />
        <Button onClick={handleBossInfoSaveClicked} type={'primary'}>
          Save
        </Button>
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(BossInfo));
