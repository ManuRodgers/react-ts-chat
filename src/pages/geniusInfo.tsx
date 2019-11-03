import React, { memo } from 'react';
import { connect } from 'dva';
import Auth from '@/components/Auth';
import { IUmiComponent, IGlobalState } from '@/interfaces';

const mapStateToProps = ({ auth }: IGlobalState) => ({
  auth,
});
type GeniusInfoStateProps = ReturnType<typeof mapStateToProps>;
interface IGeniusInfoProps extends IUmiComponent, GeniusInfoStateProps {}
const GeniusInfo: React.FunctionComponent<IGeniusInfoProps> = ({ dispatch }) => {
  console.log('TCL: dispatch', dispatch);
  return (
    <div>
      <Auth dispatch={dispatch} /> GeniusInfo
    </div>
  );
};

export default memo(connect(mapStateToProps)(GeniusInfo));
