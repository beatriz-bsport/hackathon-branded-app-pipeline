// @flow

import React, { Component } from 'react';

import {
  Button,
  Divider,
  Typography,
  Grid,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import type { TFunction } from 'react-i18next';
import StripeCheckout from './StripeCheckout.component';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';
import { formatAsDatetime, humanizeDate } from '../../../datetime';
import { ActivityMinimalSummary } from '../../../components';
import { Moment } from '../../../i18n';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

const styles = (theme) => ({
  offerTitle: {
    marginBottom: theme.spacing.unit * 2,
  },
  onlyForNewMember: {
    margin: theme.spacing.unit * 2,
  },
});

type Props = {
  loading: boolean,
  paymentPack: Object,
  membership: Membership,
  offerToBuy: ?number,
  goBack: () => void,
  t: TFunction,
  classes: Object,
};

export class PaymentPackPayment extends Component<Props> {
  getBasket = () => {
    const { t, paymentPack, offerToBuy, classes } = this.props;
    if (paymentPack && offerToBuy) {
      const humanDate = humanizeDate(Moment(offerToBuy.date_start));
      return (
        <div>
          <Typography variant="display2" className={classes.offerTitle}>
            {`${humanDate.day} ${t(humanDate.month)} - ${humanDate.time}`}
          </Typography>
          <ActivityMinimalSummary
            date={formatAsDatetime(offerToBuy.date_start)}
            activity={offerToBuy.activity}
          />
          <Divider />
          <PaymentPackSummary paymentPack={paymentPack} />
        </div>
      );
    }
    if (paymentPack) {
      return <PaymentPackSummary paymentPack={paymentPack} />;
    }
    return null;
  };

  renderStripeForm = () => {
    const { t, classes, loading, paymentPack, offerToBuy } = this.props;
    if (paymentPack.new_member_only && this.props.hasBoughtSomething) {
      return (
        <div>
          <Typography className={classes.onlyForNewMember}>
            {
              "Cette offre n'est disponible que pour les membres n'ayant jamais réservé !"
            }
          </Typography>
          <Grid container item justify="center" alignItems="stretch">
            <Button
              color="primary"
              variant="contained"
              onClick={this.props.goBack}
            >
              {t('marketplace.backToCalendar')}
            </Button>
          </Grid>
        </div>
      );
    }
    return (
      <Elements>
        <StripeCheckout
          purchaseType="pass"
          purchaseId={paymentPack.id}
          price={paymentPack === null ? ' - ' : paymentPack.price}
          loading={loading}
          offerToBuy={offerToBuy ? offerToBuy.id : null}
        />
      </Elements>
    );
  };

  render() {
    return (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          <Divider />
          <Grid item>{this.renderStripeForm()}</Grid>
        </Grid>
      </StripeProvider>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPackPayment));
