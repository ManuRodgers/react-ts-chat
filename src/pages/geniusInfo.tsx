import React, { memo, useState, useCallback, ReactNode } from 'react';
import { connect } from 'dva';
import { NavBar, NoticeBar, WhiteSpace, List, InputItem, TextareaItem, Button } from 'antd-mobile';

import Auth from '@/components/Auth';
import AvatarSelector from '@/components/AvatarSelector';
import { geniusInfoAsync } from '@/actions/geniusActions';
import { IUmiComponent, IGlobalState } from '@/interfaces';

const mapStateToProps = ({ genius, auth }: IGlobalState) => ({
  genius,
  auth,
});
type GeniusInfoStateProps = ReturnType<typeof mapStateToProps>;
interface IGeniusInfoProps extends IUmiComponent, GeniusInfoStateProps {}
const GeniusInfo: React.FunctionComponent<IGeniusInfoProps> = ({ dispatch, auth }) => {
  const { errorMsg } = auth;
  const [avatar, setAvatar] = useState<string>('');
  const getSelectedAvatarName = useCallback(
    (value: string): string => {
      setAvatar(value);
      return value;
    },
    [avatar],
  );

  // job
  const [job, setJob] = useState<string>('');
  const handleJobChange = useCallback(
    job => {
      setJob(job);
    },
    [job],
  );
  // salary
  const [salary, setSalary] = useState<string>('');
  const handleSalaryChange = useCallback(
    salary => {
      setSalary(salary);
    },
    [salary],
  );
  // salary
  const [profile, setProfile] = useState<string>('');
  const handleProfileChange = useCallback(
    profile => {
      setProfile(profile);
    },
    [profile],
  );

  const handleGeniusInfoSaveClicked: React.MouseEventHandler<
    HTMLAnchorElement
  > = useCallback(() => {
    dispatch(geniusInfoAsync({ avatar, job, salary, profile }));
  }, [avatar, job, salary, profile]);

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
      <NavBar mode="dark">Complete Genius Information</NavBar>
      {generateErrorMsg(errorMsg)}
      <AvatarSelector getSelectedAvatarName={getSelectedAvatarName} />
      <WhiteSpace />
      <List renderHeader={`Please enter your basic information`}>
        <InputItem value={job} onChange={handleJobChange}>
          Job:
        </InputItem>
        <InputItem value={salary} onChange={handleSalaryChange}>
          Salary
        </InputItem>
        <TextareaItem
          rows={3}
          count={144}
          clear={true}
          title={`profile`}
          placeholder={`Please enter  profile`}
          value={profile}
          onChange={handleProfileChange}
        />
        <Button onClick={handleGeniusInfoSaveClicked} type={'primary'}>
          Save
        </Button>
      </List>
    </div>
  );
};

export default memo(connect(mapStateToProps)(GeniusInfo));
