// @flow

import React, { Component } from 'react';

import { Grid, withStyles, Divider } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import StripeCheckout from './StripeCheckout.component';
import PaymentPackSummary from './PaymentPackSummary.component';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

const styles = () => ({
  container: {},
});

type Props = {
  loading: boolean,
  paymentPack: Object,
  offerToBuy: ?number,
};

export class PaymentPackPayment extends Component<Props> {
  getBasket = () => {
    const { paymentPack } = this.props;
    if (paymentPack) {
      return <PaymentPackSummary paymentPack={this.props.paymentPack} />;
    }
    return null;
  };

  render() {
    const { loading, paymentPack, offerToBuy } = this.props;
    return (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>
            <Elements>
              <StripeCheckout
                purchaseType="pass"
                purchaseId={paymentPack.id}
                price={paymentPack === null ? ' - ' : paymentPack.price}
                loading={loading}
                offerToBuy={offerToBuy}
              />
            </Elements>
          </Grid>
        </Grid>
      </StripeProvider>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPackPayment));
