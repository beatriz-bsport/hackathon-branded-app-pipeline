// @flow

import React, { Component } from 'react';

import {
  Button,
  List,
  Grid,
  CircularProgress,
  ListItem,
  Typography,
  Divider,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import parse from '../../query-string';

import OfferSummary from './OfferSummary.component';
import ConsumerPackCheckout from './ConsumerPackCheckout.component';
import PaymentPackSummary from './PaymentPackSummary.component';
import type { ConsumerPaymentPackConsumerView, Offer } from '../../api/types';

type Props = {
  location: Object,

  offer: Offer,
  compatibleConsumerPacks: Array<ConsumerPaymentPackConsumerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,

  loading: boolean,

  t: (x: string) => string,
  goToPassMarketplace: () => void,
  onCompletePurchase: () => void,
  onBuyPaymentPack: (packId: number) => void,
};

export class OfferPayment extends Component<Props> {
  componentWillMount() {
    const { option_id } = parse(this.props.location.search);
    if (option_id) {
      this.urlParams = { option_id };
    } else {
      this.urlParams = {};
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
            <OfferSummary offer={offer} />
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
    ) {
    return null;
    }
    if (compatibleConsumerPacks.length === 0) {
      return (
        <Grid container direction="column" spacing={16} alignItems="flex-start">
          <Grid item>
            <Typography>
              Vous ne disposez pas de pass compatible avec cette séance !
            </Typography>
          </Grid>
        </Grid>
      );
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

  renderBookingWithUnlimitedPass = (unlimitedPacks: Array<Object>) => {
    return unlimitedPacks.map((pack) => (
      <ConsumerPackCheckout
        key={pack.id}
        consumerPack={pack}
        offerId={this.props.offer.id}
        creditPrice={this.props.offer.credit_price}
        onCompletePurchase={this.props.onCompletePurchase}
      />
    ));
  };

  renderBuyCompatiblePaymentPack = () => {
    const {
      t,
      compatiblePaymentPacksLoading,
      compatiblePaymentPacks,
      compatibleConsumerPacksLoading,
    } = this.props;
    if (compatibleConsumerPacksLoading) {
      return null; // avoid double loader indicator
    }
    if (compatiblePaymentPacksLoading) {
      return (
        <Grid container item justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <List>
        {(compatiblePaymentPacks || []).length ? (
          <Typography variant="h6">
            Pass compatible avec cette séance
          </Typography>
        ) : null}
        {(compatiblePaymentPacks || []).map((pp) => (
          <ListItem divider key={pp.id}>
            <Grid
              container
              direction="row"
              justify="space-betweeen"
              alignItems="center"
            >
              <Grid item>
                <PaymentPackSummary noDivider paymentPack={pp} />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => this.props.onBuyPaymentPack(pp.id)}
                >
                  {t('common.buy')}
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    );
  };

  render() {
    const { loading, offer, t } = this.props;

    const unlimitedPacks = this.getCompatibleUnlimitedPass();
    if (unlimitedPacks.length && !loading && !(offer === null)) {
      return (
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>
            {this.renderBookingWithUnlimitedPass(unlimitedPacks)}
          </Grid>
          <Grid item>{this.renderBuyCompatiblePaymentPack()}</Grid>
          <Button
            color="primary"
            variant="contained"
            onClick={this.props.goToPassMarketplace}
          >
            {t('marketplace.backToCalendar')}
          </Button>
        </Grid>
      );
    }

    return (
      <Grid container spacing={16} direction="column">
        <Grid item>{this.getBasket()}</Grid>
        <Divider />
        <Grid item>{this.getPaymentPacksCheckout()}</Grid>
        <Grid item>{this.renderBuyCompatiblePaymentPack()}</Grid>
        <Button
          color="primary"
          variant="contained"
          onClick={this.props.goToPassMarketplace}
        >
          {t('marketplace.backToCalendar')}
        </Button>
      </Grid>
    );
  }
}

export default withRouter(translate()(OfferPayment));
