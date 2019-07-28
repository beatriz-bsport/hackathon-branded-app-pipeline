// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import type { TFunction } from 'react-i18next';
import StripeCheckout from './StripeCheckout.component';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';
import { formatAsDatetime, humanizeDate } from '../../../datetime';
import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import { Moment } from '../../../i18n';

import Config from '../../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

const styles = (theme) => ({
  doNotBookPast: {
    margin: theme.spacing.unit * 2,
  },
  offerTitle: {
    marginBottom: theme.spacing.unit * 2,
  },
  onlyForNewMember: {
    margin: theme.spacing.unit * 2,
  },
});

type Props = {
  hasBoughtSomething: ?boolean,
  loading: boolean,
  paymentPack: Object,
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
          <Typography variant="h3" className={classes.offerTitle}>
            {`${humanDate.day} ${t(humanDate.month)} - ${humanDate.time}`}
          </Typography>
          <Paper>
            <ActivityMinimalSummary
              date={formatAsDatetime(offerToBuy.date_start)}
              activity={offerToBuy.activity}
            />
            <Divider />
            <PaymentPackSummary paymentPack={paymentPack} />
          </Paper>
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
    if (offerToBuy && Moment(offerToBuy.date_start).isBefore(Moment())) {
      return (
        <Grid item>
          <Typography variant="h6" className={classes.doNotBookPast}>
            Impossible de réserver une séance dans le passé !
          </Typography>
        </Grid>
      );
    }
    if (paymentPack.new_member_only && this.props.hasBoughtSomething) {
      return (
        <div>
          <Typography className={classes.onlyForNewMember}>
            {
              /* eslint-disable */
              "Cette offre n'est disponible que pour les membres n'ayant jamais réservé !"
              /* eslint-enable */
            }
          </Typography>
          <Grid container item justify="center" alignItems="stretch">
            <Button
              color="secondary"
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
      <StripeProvider apiKey={STRIPE_KEY}>
        <Elements>
          <StripeCheckout
            purchaseType="pass"
            purchaseId={paymentPack.id}
            price={paymentPack === null ? ' - ' : paymentPack.price}
            loading={loading}
            offerToBuy={offerToBuy ? offerToBuy.id : null}
          />
        </Elements>
      </StripeProvider>
    );
  };

  render() {
    return (
      <Grid container spacing={16} direction="column">
        <Grid item>{this.getBasket()}</Grid>
        <Grid item>{this.renderStripeForm()}</Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withNamespaces()(PaymentPackPayment));
