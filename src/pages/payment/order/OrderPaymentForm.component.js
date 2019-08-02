// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Elements, StripeProvider } from 'react-stripe-elements';
import OrderListItem from '../../../libs/order/components/OrderListItem.component';
import type { OrderWithProducts } from '../../../libs/order/types';

import StripeCheckout from './StripeCheckout.component';

import Config from '../../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  loading: boolean,
  order: OrderWithProducts,
  onPaymentSuccess: () => void,
};

export default (props: Props) => {
  const { order, loading } = props;
  return (
    <Grid
      container
      spacing={16}
      direction="column"
      style={{
        minWidth: '50vh',
      }}
    >
      <Grid item>
        <Paper>
          <OrderListItem order={order} />
        </Paper>
      </Grid>
      <Grid item>
        <StripeProvider apiKey={STRIPE_KEY}>
          <Elements>
            <StripeCheckout
              purchaseType="order"
              purchaseId={order.id}
              price={order.total_price}
              loading={loading}
              onPaymentSuccess={props.onPaymentSuccess}
            />
          </Elements>
        </StripeProvider>
      </Grid>
    </Grid>
  );
};
