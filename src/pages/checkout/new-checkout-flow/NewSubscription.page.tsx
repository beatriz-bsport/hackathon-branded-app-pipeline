import React from 'react';
import { Typography } from '@material-ui/core';
import { compose } from 'recompose';
// @ts-ignore
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  contractId: number;
  companyId: number;
};

/* This is a placeholder page for testing that the routing to the new subscription page should work.
This page will be deleted once the new subscription page is merged */

const NewSubscriptionPage: React.FC<Props> = (props) => {
  return (
    <div>
      <Typography variant="h6">Subscription (new booking flow)</Typography>
      <Typography>{`contractId: ${props.contractId}`}</Typography>
      <Typography>{`companyId: ${props.companyId}`}</Typography>
    </div>
  );
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId',
    contractId: 'contractId:number',
  }),
)(NewSubscriptionPage);
