import React, { memo } from 'react';
import { connect } from 'dva';
import Auth from '@/components/Auth';
import { IUmiComponent, IGlobalState } from '@/interfaces';

const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type BossInfoStateProps = ReturnType<typeof mapStateToProps>;
interface IBossInfoProps extends IUmiComponent, BossInfoStateProps {}
const BossInfo: React.FunctionComponent<IBossInfoProps> = ({ dispatch }) => {
  console.log('TCL: dispatch', dispatch);
  return (
    <div>
      <Auth dispatch={dispatch} /> BossInfo
    </div>
  );
};

export default memo(connect(mapStateToProps)(BossInfo));
