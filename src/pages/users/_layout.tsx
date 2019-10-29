import * as React from 'react';
import IUmiComponent from '@/interfaces/IUmiComponent';

interface IUsersLayoutProps extends IUmiComponent {}

const UsersLayout: React.FunctionComponent<IUsersLayoutProps> = ({ children, location }) => {
  return <div>{children}</div>;
};

export default UsersLayout;
