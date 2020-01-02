// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';
import type {
  ConsumerPaymentPackConsumerView,
  Offer,
} from '../../../api/types';

import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import { formatAsDatetime } from '../../../datetime';

import ConsumerPackCheckout from './ConsumerPackCheckout.component';
import PaymentComboBuyableItem from './PaymentComboBuyableItem.component';
import type { PaymentCombo } from '../../../libs/payment-combo/types';

type Props = {
  classes: Object,

  offer: Offer,
  compatibleConsumerPacks: Array<ConsumerPaymentPackConsumerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,

  onBuyPaymentCombo: (comboId: number, offerId: number) => void,
  paymentComboList: Array<PaymentCombo>,

  loading: boolean,
  hasOneOrMoreOption: boolean,

  theme: CompanyTheme,
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
        <div className={this.props.classes.column}>
          <Typography className={this.props.classes.title} variant="h3">
            {localDateUpper}
          </Typography>
          <Paper>
            <OfferSummary offer={offer} />
          </Paper>
        </div>
      );
    }
    return <CircularProgress className={this.props.classes.centeredLoading} />;
  };

  getPaymentPacksCheckout = () => {
    const {
      t,
      offer,
      compatibleConsumerPacks,
      compatibleConsumerPacksLoading,
    } = this.props;

    if (compatibleConsumerPacksLoading || offer === null) {
      return <LinearProgress />;
    }
    if (compatibleConsumerPacks.length === 0) {
      return (
        <Typography className={this.props.classes.sectionTitle}>
          Vous ne disposez pas de pass compatible avec cette séance !
        </Typography>
      );
    }
    return (
      <div className={this.props.classes.column}>
        <Typography variant="h6" color="primary">
          {compatibleConsumerPacks.length}
        </Typography>
        <Typography variant="h6">
          {t('payment:availablePaymentPacks')}
        </Typography>
        {compatibleConsumerPacks.map((ppc) => (
          <ConsumerPackCheckout
            key={ppc.id}
            noDivider
            consumerPack={ppc}
            offerId={offer.id}
            creditPrice={offer.credit_price}
            onBookFromPack={() => this.props.onBookFromPack(ppc.id)}
          />
        ))}
      </div>
    );
  };

  renderPaymentCombo = () => {
    const { t, compatiblePaymentPacks, paymentComboList } = this.props;
    const compatiblePackIds = compatiblePaymentPacks.map((pp) => pp.id);

    const relevantPaymentComboList = paymentComboList.filter((pc) =>
      pc.payment_packs
        .map((pp) => pp.id)
        .some((id) => compatiblePackIds.includes(id)),
    );

    if (relevantPaymentComboList.length > 0) {
      return (
        <div>
          <Typography
            variant="h6"
            component="h2"
            className={this.props.classes.sectionTitle}
          >
            {t('payment:paymentComboSectionTitle')}
          </Typography>
          <List disablePadding className={this.props.classes.passList}>
            {relevantPaymentComboList.map((pc) => (
              <PaymentComboBuyableItem
                key={pc.id}
                paymentCombo={pc}
                onClick={() =>
                  this.props.onBuyPaymentCombo(pc.id, this.props.offer.id)
                }
              />
            ))}
          </List>
        </div>
      );
    }
    return null;
  };

  renderBuyCompatiblePaymentPack = () => {
    const {
      compatiblePaymentPacksLoading,
      compatiblePaymentPacks,
      compatibleConsumerPacksLoading,
      theme,
    } = this.props;

    if (compatiblePaymentPacksLoading && !compatibleConsumerPacksLoading) {
      return <LinearProgress />;
    }

    let compatiblePaymentPacksFiltered = compatiblePaymentPacks;

    if (
      compatiblePaymentPacks &&
      compatiblePaymentPacks.length &&
      theme &&
      theme.hide_least_specific_payment_pack
    ) {
      const leastSpecific =
        Math.min(
          ...compatiblePaymentPacks
            .map((pp) => pp.establishments.length)
            .filter((c) => c > 0),
        ) || 1000;

      compatiblePaymentPacksFiltered = compatiblePaymentPacks.filter(
        (pp) => pp.establishments.length <= leastSpecific,
      );
    }

    return (
      <div>
        {this.renderPaymentCombo()}
        {(compatiblePaymentPacksFiltered || []).length ? (
          <Typography
            variant="h6"
            component="h2"
            className={this.props.classes.sectionTitle}
          >
            Pass compatible avec cette séance
          </Typography>
        ) : null}
        <List className={this.props.classes.passList} disablePadding>
          {(compatiblePaymentPacksFiltered || []).map((pp) => (
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
        <Typography variant="h6" className={classes.doNotBookPast}>
          Impossible de réserver une séance dans le passé !
        </Typography>
      );
    }
    return (
      <div className={this.props.classes.paddedRow}>
        {this.getPaymentPacksCheckout()}
        {this.renderBuyCompatiblePaymentPack()}
      </div>
    );
  };

  renderOfferNotAvailable = () => {
    if (this.props.offer && !this.props.offer.available) {
      return (
        <Typography
          variant="h6"
          color="secondary"
          className={this.props.classes.noOfferTypography}
        >
          Cette séance a été annulée
        </Typography>
      );
    }
    return null;
  };

  render() {
    const { loading, hasOneOrMoreOption, offer, t, bookingOption } = this.props;

    if (loading) {
      return (
        <div className={this.props.classes.centeredLoading}>
          <CircularProgress />
        </div>
      );
    }

    if (
      offer &&
      offer.is_full &&
      offer.is_waiting_list_full &&
      !(bookingOption && bookingOption.is_convertible)
    ) {
      return (
        <div className={this.props.classes.container}>
          {this.getBasket()}
          <Typography align="center">
            {
              // eslint-disable-next-line
              "Toutes les places ont été réservées, et la liste d'attente est pleine."
            }
          </Typography>
          <div className={this.props.classes.bottomButtonContainer}>
            <Button color="secondary" onClick={this.props.goToPassMarketplace}>
              {t('payment:goBack')}
            </Button>
          </div>
        </div>
      );
    }

    if (
      offer &&
      !loading &&
      (offer.is_full && !(bookingOption && bookingOption.is_convertible))
    ) {
      return (
        <div className={this.props.classes.column}>
          {this.getBasket()}
          {hasOneOrMoreOption ? (
            <Typography
              className={this.props.classes.paddedRow}
              color="textSecondary"
              variant="caption"
            >
              {t('payment:hasOneOrMoreOption')}
            </Typography>
          ) : null}
          <Button
            color="primary"
            variant="outlined"
            onClick={() => this.props.bookAnOption(offer.id)}
          >
            {hasOneOrMoreOption
              ? t('payment:bookAnotherOption')
              : t('payment:bookAnOption')}
          </Button>
          <Typography
            variant="caption"
            className={this.props.classes.paddedRow}
          >
            {t('payment:explainOption')}
          </Typography>
          <div className={this.props.classes.bottomButtonContainer}>
            <Button color="secondary" onClick={this.props.goToPassMarketplace}>
              {t('payment:goBack')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.classes.column}>
        {this.getBasket()}
        {offer && offer.available
          ? this.renderBuyingMethods()
          : this.renderOfferNotAvailable()}
        <div className={this.props.classes.bottomButtonContainer}>
          <Button color="secondary" onClick={this.props.goToPassMarketplace}>
            {t('payment:goBack')}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    paddingBottom: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  noOfferTypography: {
    margin: theme.spacing.unit * 2,
  },
  centeredLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doNotBookPast: {
    margin: theme.spacing.unit * 2,
  },
  paddedRow: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
  },
  passList: {
    border: '1px solid #E8E8E8',
    borderRadius: 8,
    marginBottom: theme.spacing.unit * 2,
  },
  bottomButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    paddingBottom: theme.spacing.unit,
  },
});

export default compose(
  withRouter,
  withNamespaces(['payment', 'datetime']),
  withStyles(styles),
)(OfferPayment);
