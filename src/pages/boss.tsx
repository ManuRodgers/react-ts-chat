import React, { memo } from 'react';
import { connect } from 'dva';
import Auth from '@/components/Auth';
import { IUmiComponent, IGlobalState } from '@/interfaces';

const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type BossStateProps = ReturnType<typeof mapStateToProps>;
interface IBossProps extends IUmiComponent, BossStateProps {}

const Boss: React.FunctionComponent<IBossProps> = ({ dispatch }) => {
  console.log('TCL: dispatch', dispatch);
  return (
    <div>
      <Auth dispatch={dispatch} /> Boss
    </div>
  );
};

export default memo(connect(mapStateToProps)(Boss));
