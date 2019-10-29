import * as React from 'react';
import IUmiComponent from '@/interfaces/IUmiComponent';

interface ICurrentUserProps extends IUmiComponent {}

const CurrentUser: React.FunctionComponent<ICurrentUserProps> = props => {
  const { computedMatch } = props;
  console.log('TCL: match.params', computedMatch!.params.id);

  return <div>CurrentUser</div>;
};

export default CurrentUser;
