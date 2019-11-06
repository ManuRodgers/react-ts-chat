import React, { memo } from 'react';
import { connect } from 'dva';

import { IUmiComponent, IGlobalState } from '../../interfaces/index';
import Auth from '../../components/Auth';

const mapStateToProps = ({ boss }: IGlobalState) => ({
  boss,
});
type MessageStateProps = ReturnType<typeof mapStateToProps>;

interface IMessageProps extends IUmiComponent, MessageStateProps {}

const Message: React.FunctionComponent<IMessageProps> = ({ dispatch }) => {
  return (
    <div>
      <Auth dispatch={dispatch} /> Message Manu
    </div>
  );
};

export default memo(connect(mapStateToProps)(Message));
