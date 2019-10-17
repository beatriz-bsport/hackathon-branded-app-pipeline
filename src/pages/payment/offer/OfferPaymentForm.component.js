// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import ConsumerPackCheckout from './ConsumerPackCheckout.component';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';
import type {
  ConsumerPaymentPackConsumerView,
  Offer,
} from '../../../api/types';

import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import { formatAsDatetime } from '../../../datetime';

type Props = {
  classes: Object,

  offer: Offer,
  compatibleConsumerPacks: Array<ConsumerPaymentPackConsumerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,

  loading: boolean,
  hasOneOrMoreOption: boolean,

  bookingOption: ?BookingOption,
  onBookFromPack: (consumerPackId: number) => void,
  t: TFunction,
  goToPassMarketplace: () => void,
  onBuyPaymentPack: (packId: number) => void,
  bookAnOption: (offerId: number) => void,
};

const OfferSummary = (props: { offer: Offer }) => (
  <ActivityMinimalSummary
    date={formatAsDatetime(
      props.offer.date_start,
      props.offer.activity.etablissement.tzname,
    )}
    activity={props.offer.activity}
    noDivider
  />
);

export class OfferPayment extends Component<Props> {
  getBasket = () => {
    const { offer, loading } = this.props;
    if (offer && !loading) {
      const momentDate = moment(offer.date_start).tz(
        offer.activity.etablissement.tzname,
      );
      const localDate = momentDate.format('LLLL');
      const localDateUpper =
        localDate[0].toUpperCase() + localDate.slice(1, localDate.length);
      return (
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Typography variant="h3">{localDateUpper}</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <OfferSummary offer={offer} />
            </Paper>
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
              <Typography variant="h6" color="primary">
                {compatibleConsumerPacks.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {t('payment:availablePaymentPacks')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {compatibleConsumerPacks.map((ppc) => (
          <Grid item key={ppc.id}>
            <ConsumerPackCheckout
              noDivider
              consumerPack={ppc}
              offerId={offer.id}
              creditPrice={offer.credit_price}
              onBookFromPack={() => this.props.onBookFromPack(ppc.id)}
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
        noDivider
        key={pack.id}
        consumerPack={pack}
        offerId={this.props.offer.id}
        creditPrice={this.props.offer.credit_price}
        onBookFromPack={() => this.props.onBookFromPack(pack.id)}
      />
    ));
  };

  renderBuyCompatiblePaymentPack = () => {
    const {
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
      <div>
        {(compatiblePaymentPacks || []).length ? (
          <Typography variant="h6" component="h2">
            Pass compatible avec cette séance
          </Typography>
        ) : null}
        <List className={this.props.classes.passList} disablePadding>
          {(compatiblePaymentPacks || []).map((pp) => (
            <PaymentPackSummary
              key={pp.id}
              paymentPack={pp}
              buyButton={
                <Button
                  variant="outlined"
                  color="primary"
                  id={`payment-pack-buy-${pp.id}`}
                  onClick={() => this.props.onBuyPaymentPack(pp.id)}
                >
                  <AddShoppingCartIcon
                    className={this.props.classes.leftIcon}
                  />
                  <Typography color="inherit">{`${pp.price}€`}</Typography>
                </Button>
              }
            />
          ))}
        </List>
      </div>
    );
  };

  renderBuyingMethods = () => {
    const { offer, classes } = this.props;
    if (offer && moment(offer.date_start).isBefore(moment())) {
      return (
        <Grid item>
          <Typography variant="h6" className={classes.doNotBookPast}>
            Impossible de réserver une séance dans le passé !
          </Typography>
        </Grid>
      );
    }
    return (
      <React.Fragment>
        <Grid item>{this.getPaymentPacksCheckout()}</Grid>
        <Grid item>{this.renderBuyCompatiblePaymentPack()}</Grid>
      </React.Fragment>
    );
  };

  renderOfferNotAvailable = () => {
    if (this.props.offer && !this.props.offer.available) {
      return (
        <Grid item>
          <Typography
            variant="h6"
            color="secondary"
            className={this.props.classes.noOfferTypography}
          >
            Cette séance a été annulée par le coach
          </Typography>
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { loading, hasOneOrMoreOption, offer, t, bookingOption } = this.props;

    const unlimitedPacks = this.getCompatibleUnlimitedPass();

    if (loading) {
      return (
        <Grid container spacing={16} direction="column" alignItems="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    if (offer && offer.is_full && offer.is_waiting_list_full) {
      return (
        <Grid container spacing={16} direction="column" alignItems="center">
          <Grid item>{this.getBasket()}</Grid>
          <Grid item>
            <Typography align="center">
              {
                // eslint-disable-next-line
                "Toutes les places ont été réservées, et la liste d'attente est pleine."
              }
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={this.props.goToPassMarketplace}
            >
              {t('payment:goBack')}
            </Button>
          </Grid>
        </Grid>
      );
    }

    if (
      offer &&
      !loading &&
      (offer.is_full && !(bookingOption && bookingOption.is_convertible))
    ) {
      return (
        <Grid container spacing={16} direction="column" alignItems="center">
          <Grid item>{this.getBasket()}</Grid>
          {hasOneOrMoreOption ? (
            <Grid item>
              <Typography color="textSecondary" variant="caption">
                {t('payment:hasOneOrMoreOption')}
              </Typography>
            </Grid>
          ) : null}
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => this.props.bookAnOption(offer.id)}
            >
              {hasOneOrMoreOption
                ? t('payment:bookAnotherOption')
                : t('payment:bookAnOption')}
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {t('payment:explainOption')}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={this.props.goToPassMarketplace}
            >
              {t('payment:goBack')}
            </Button>
          </Grid>
        </Grid>
      );
    }
    if (unlimitedPacks.length && !loading && !(offer === null)) {
      return (
        <Grid container spacing={16} direction="column">
          <Grid item>{this.getBasket()}</Grid>
          {offer && offer.available ? (
            <React.Fragment>
              <Grid item>
                <div className={this.props.classes.passList}>
                  {this.renderBookingWithUnlimitedPass(unlimitedPacks)}
                </div>
              </Grid>
              <Grid item>{this.renderBuyCompatiblePaymentPack()}</Grid>
            </React.Fragment>
          ) : (
            this.renderOfferNotAvailable()
          )}
          <Button
            color="secondary"
            variant="contained"
            onClick={this.props.goToPassMarketplace}
          >
            {t('payment:goBack')}
          </Button>
        </Grid>
      );
    }

    return (
      <Grid container spacing={16} direction="column">
        <Grid item>{this.getBasket()}</Grid>
        {offer && offer.available
          ? this.renderBuyingMethods()
          : this.renderOfferNotAvailable()}
        <Button
          color="secondary"
          variant="contained"
          onClick={this.props.goToPassMarketplace}
        >
          {t('payment:goBack')}
        </Button>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  noOfferTypography: {
    margin: theme.spacing.unit * 2,
  },
  doNotBookPast: {
    margin: theme.spacing.unit * 2,
  },
  passList: {
    border: '1px solid #E8E8E8',
    borderRadius: 8,
  },
});

export default compose(
  withRouter,
  withNamespaces(['payment', 'datetime']),
  withStyles(styles),
)(OfferPayment);
