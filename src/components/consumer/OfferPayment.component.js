import React, { Component } from 'react';

import {
  List,
  Grid,
  CircularProgress,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import StripeCheckout from './StripeCheckout.component';
import OfferSummary from './OfferSummary.component';
import ConsumerPackCheckout from './ConsumerPackCheckout.component';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

const styles = () => ({
  container: {},
});

type Props = {
  loading: boolean,
  offer: Object,
};

export class OfferPayment extends Component<Props> {
  getBasket = () => {
    const { offer, loading, t } = this.props;
    if (offer && !loading) {
      return (
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Typography variant="display2">
              {t('payment.yourBasket')}
            </Typography>
          </Grid>
          <Grid item>
            <OfferSummary offer={offer} />;
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container item justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  };

  getPaymentPacksCheckout = () => {
    const {
      t,
      offer,
      compatibleConsumerPacks,
      compatibleConsumerPacksLoading,
      onCompletePurchase,
    } = this.props;
    if (
      compatibleConsumerPacksLoading ||
      offer === null ||
      compatibleConsumerPacks.length === 0
    ) {
      return null;
    }
    return (
      <Grid container direction="column" alignItems="stretch" spacing={32}>
        <Grid item>
          <Grid container spacing={8}>
            <Grid item>
              <Typography variant="title" color="primary">
                {compatibleConsumerPacks.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="title">
                {t('payment.availablePaymentPacks')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {compatibleConsumerPacks.map((ppc) => (
          <Grid item key={ppc.id}>
            <ConsumerPackCheckout
              consumerPack={ppc}
              offerId={offer.id}
              creditPrice={offer.credit_price}
              onCompletePurchase={onCompletePurchase}
            />
          </Grid>
        ))}
        <Divider />
      </Grid>
    );
  };

  render() {
    const { loading, offer } = this.props;
    return (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>{this.getPaymentPacksCheckout()}</Grid>
          <Grid item>
            <Elements>
              <StripeCheckout
                price={offer === null ? ' - ' : offer.price}
                loading={loading}
              />
            </Elements>
          </Grid>
        </Grid>
      </StripeProvider>
    );
  }
}

export default withStyles(styles)(translate()(OfferPayment));
