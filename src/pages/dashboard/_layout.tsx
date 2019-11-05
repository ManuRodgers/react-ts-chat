import React, { memo } from 'react';
import Auth from '@/components/Auth';
import { connect } from 'dva';
import { IUmiComponent, IGlobalState } from '@/interfaces';
const mapStateToProps = ({ boss }: IGlobalState) => ({
  boss,
});
type DashboardStateProps = ReturnType<typeof mapStateToProps>;
interface IDashboardProps extends IUmiComponent, DashboardStateProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = ({ children, dispatch }) => {
  return (
    <div>
      <Auth dispatch={dispatch} />
      <div>header</div>
      <div>{children}</div>
      <div>footer</div>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Dashboard));
