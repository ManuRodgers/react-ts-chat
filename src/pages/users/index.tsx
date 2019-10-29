import React, { useCallback } from 'react';
import router from 'umi/router';

interface IUsersProps {}

const Users: React.FunctionComponent<IUsersProps> = props => {
  const handleGoHomePage: React.MouseEventHandler = useCallback(() => router.push('/'), []);
  return (
    <div>
      users <button onClick={handleGoHomePage}>homepage</button>
    </div>
  );
};

export default Users;
