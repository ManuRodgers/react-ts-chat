import React from 'react';
import Auth from '@/components/Auth';

interface IBossProps {}

const AuthRoot: React.FunctionComponent<IBossProps> = props => {
  return (
    <div>
      <Auth />
    </div>
  );
};

export default AuthRoot;
