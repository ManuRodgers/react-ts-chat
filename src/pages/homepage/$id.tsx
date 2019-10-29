import React from 'react';
import IUmiComponent from '@/interfaces/IUmiComponent';

interface ICurrentUserProps extends IUmiComponent {}

const CurrentUser: React.FunctionComponent<ICurrentUserProps> = props => {
  const { match } = props;
  console.log('TCL: match.params', match.params);
  return <div>CurrentUser</div>;
};

export default CurrentUser;
