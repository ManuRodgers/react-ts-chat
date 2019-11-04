/**
 * title: Index Page
 */
import React, { memo } from 'react';
import Auth from '@/components/Auth';
import { connect } from 'dva';
import { IUmiComponent } from '@/interfaces';

interface IAppProps extends IUmiComponent {}

const App: React.FunctionComponent<IAppProps> = ({ dispatch }) => {
  return (
    <div>
      <Auth dispatch={dispatch} /> hello manu
    </div>
  );
};

export default memo(connect()(App));
