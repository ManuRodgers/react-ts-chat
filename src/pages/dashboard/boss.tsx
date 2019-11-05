import React, { memo } from 'react';
import { connect } from 'dva';
import Auth from '@/components/Auth';
import { IUmiComponent, IGlobalState } from '@/interfaces';

const mapStateToProps = ({ boss }: IGlobalState) => ({
  boss,
});
type BossStateProps = ReturnType<typeof mapStateToProps>;
interface IBossProps extends IUmiComponent, BossStateProps {}

const Boss: React.FunctionComponent<IBossProps> = ({ boss, dispatch }) => {
  return (
    <div>
      <Auth dispatch={dispatch} /> Boss Manu
    </div>
  );
};

export default memo(connect(mapStateToProps)(Boss));
