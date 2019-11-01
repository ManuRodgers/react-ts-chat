import * as React from 'react';
import logoImg from '@/images/logo.png';

interface ILogoProps {}

const Logo: React.FunctionComponent<ILogoProps> = props => {
  return (
    <div className={`logo-container`}>
      <img src={logoImg} alt="" />
    </div>
  );
};

export default Logo;
