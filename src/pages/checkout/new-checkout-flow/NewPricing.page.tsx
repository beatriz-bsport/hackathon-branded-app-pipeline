import React from 'react';
import { Typography } from '@material-ui/core';
import { compose } from 'recompose';
// @ts-ignore
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  offerId: number;
  companyId: number;
};

/* This is a placeholder page for testing that the routing to the new pricing page should work.
This page will be deleted once the new pricing page is merged */

const NewPricingPage: React.FC<Props> = (props) => {
  return (
    <div>
      <Typography variant="h6">Pricing (new booking flow)</Typography>
      <Typography>{`offerId: ${props.offerId}`}</Typography>
      <Typography>{`companyId: ${props.companyId}`}</Typography>
    </div>
  );
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
  }),
)(NewPricingPage);
