import React, { memo } from 'react';
import { connect } from 'dva';

import { IUmiComponent, IGlobalState } from '../../interfaces/index';
import Auth from '../../components/Auth';

const mapStateToProps = ({ boss }: IGlobalState) => ({
  boss,
});
type MeStateProps = ReturnType<typeof mapStateToProps>;

interface IMeProps extends IUmiComponent, MeStateProps {}

const Me: React.FunctionComponent<IMeProps> = ({ dispatch }) => {
  return (
    <div>
      <Auth dispatch={dispatch} /> Me Manu
    </div>
  );
};

export default memo(connect(mapStateToProps)(Me));
