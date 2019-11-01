import React, { useEffect } from 'react';
import withRouter from 'umi/withRouter';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IUmiComponent } from '@/interfaces';
import { usePrevious } from '@/util/hooks';

interface IGlobalLayoutProps extends IUmiComponent {}

const GlobalLayout: React.FunctionComponent<IGlobalLayoutProps> = ({ location, children }) => {
  const prevLocation = usePrevious(location);
  // scroll to top for different location path
  useEffect(() => {
    location !== prevLocation && window.scrollTo(0, 0);
  }, [location]);
  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(GlobalLayout);
