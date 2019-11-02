/**
 * title: Index Page
 * exact: false
 */
import React from 'react';
import Auth from '@/components/Auth';

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = props => {
  return (
    <div>
      <Auth /> hello manu
    </div>
  );
};

export default App;
