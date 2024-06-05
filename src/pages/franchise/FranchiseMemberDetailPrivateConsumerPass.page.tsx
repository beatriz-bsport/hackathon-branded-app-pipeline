import React from 'react';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

type OwnProps = {
  userId: number;
};

const FranchiseMemberDetailPrivateConsumerPass: React.FC<OwnProps> = () => {
  return <div />;
};

export default compose<OwnProps, {}>(
  React.memo,
  routerParamsToProps({ userId: 'userId:number' }),
)(FranchiseMemberDetailPrivateConsumerPass);
