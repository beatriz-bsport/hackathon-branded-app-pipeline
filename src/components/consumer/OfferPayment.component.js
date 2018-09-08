// @flow

import React, { Component } from 'react';

import { Grid, CircularProgress, Typography, Divider } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';

import StripeCheckout from './StripeCheckout.component';
import OfferSummary from './OfferSummary.component';
import ConsumerPackCheckout from './ConsumerPackCheckout.component';
import type { ConsumerPaymentPackConsumerView, Offer } from '../../api/types';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

type Props = {
  loading: boolean,
  offer: Offer,
  location: Object,
  t: (x: string) => string,
  onCompletePurchase: () => void,
  compatibleConsumerPacks: Array<ConsumerPaymentPackConsumerView>,
  compatibleConsumerPacksLoading: boolean,
};

type State = {
  stripe: ?Object,
};

export class OfferPayment extends Component<Props, State> {
  state = {
    stripe: null,
  };

  componentWillMount() {
    const { option_id } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    if (option_id) {
      this.urlParams = { option_id };
    } else {
      this.urlParams = {};
    }
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(STRIPE_KEY) });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({ stripe: window.Stripe(STRIPE_KEY) });
      });
    }
  }

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

    // prettier-ignore
    if (
      compatibleConsumerPacksLoading
      || offer === null
      || compatibleConsumerPacks.length === 0
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
              urlParams={this.urlParams}
            />
          </Grid>
        ))}
        <Divider />
      </Grid>
    );
  };

  getCompatibleUnlimitedPass = () => {
    const { compatibleConsumerPacks } = this.props;
    return compatibleConsumerPacks.filter((cpp) => cpp.payment_pack.unlimited);
  };

  renderBookingWithUnlimitedPass = (unlimitedPacks: Array<Object>) => (
    <ConsumerPackCheckout
      consumerPack={unlimitedPacks[0]}
      offerId={this.props.offer.id}
      creditPrice={this.props.offer.credit_price}
      onCompletePurchase={this.props.onCompletePurchase}
    />
  );

  render() {
    const { loading, offer } = this.props;
    const { stripe } = this.state;

    const unlimitedPacks = this.getCompatibleUnlimitedPass();
    if (unlimitedPacks.length && !loading && !(offer === null)) {
      return (
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>
            {this.renderBookingWithUnlimitedPass(unlimitedPacks)}
          </Grid>
        </Grid>
      );
    }

    return (
      <StripeProvider stripe={stripe}>
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>{this.getPaymentPacksCheckout()}</Grid>
          <Grid item>
            <Elements>
              <StripeCheckout
                price={offer === null ? ' - ' : offer.price}
                loading={loading}
                urlParams={this.urlParams}
                purchaseType="offer"
                purchaseId={(offer || { id: null }).id}
              />
            </Elements>
          </Grid>
        </Grid>
      </StripeProvider>
    );
  }
}

export default withRouter(translate()(OfferPayment));
