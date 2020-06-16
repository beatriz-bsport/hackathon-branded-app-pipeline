// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import BlockIcon from '@material-ui/icons/Block';
import LockIcon from '@material-ui/icons/Lock';
import TodayIcon from '@material-ui/icons/Today';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import OfferListItemConsumer from '../../offer/components/OfferListItemConsumer.component';

import PaymentComboBuyableItem from '../../payment-combo/components/PaymentComboBuyableItem.component';
import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPaymentPackListItemCheckout from '../../consumer-payment-pack/components/ConsumerPaymentPackListItemCheckout.component';
import SubscriptionContractListItem from '../../subscription/components/SubscriptionContractListItem.component';
import { isOfferBookableYet } from '../../marketplace/utils';
import type { ConsumerPaymentPack } from '../../consumer-payment-pack/types';

import type { OptionCallback } from '../../../state/types';

type Props = {
  t: TFunction,
  classes: Object,
  consumerPaymentPackList: Array<ConsumerPaymentPack>,
  paymentPackList: Array<PaymentPack>,
  offer: Offer,
  loading: boolean,
  bookingOptionListConvertible: Array<BookingOption>,
  bookingOptionListUnconvertible: Array<BookingOption>,
  registerOption: (OptionCallback) => void,
  bookWithConsumerPaymentPack: (id: number, options: OptionCallback) => void,
  contractList: Array<Contract>,
  buyContract: (Contract) => void,
  comboList: Array<PaymentCombo>,
  buyPaymentCombo: (id: number, options: OptionCallback) => void,
  buyPaymentPack: (id: number) => void,
};

const BookingOptionRegisterForm = withState(
  'processing',
  'setProcessing',
  false,
)(
  (props: {
    t: TFunction,
    classes: Object,
    processing: boolean,
    setProcessing: (boolean) => void,
    onClick: (options: OptionCallback) => void,
    bookingOption: ?BookingOption,
    bookingOptionLoading: boolean,
    hasBookingOptionUnConvertible: boolean,
  }) => {
    if (props.hasBookingOptionUnConvertible) {
      return (
        <div className={props.classes.innerContainer}>
          <HourglassEmptyIcon className={props.classes.bigIcon} />
          <Typography className={props.classes.explainText}>
            {props.t('bookingModule.option.isAlreadyOnWaitingList')}
          </Typography>
        </div>
      );
    }
    return (
      <div className={props.classes.innerContainer}>
        <Typography className={props.classes.explainText}>
          {props.t('bookingModule.option.isFull')}
        </Typography>
        {props.processing ? (
          <CircularProgress />
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              props.setProcessing(true);
              props.onClick({
                onSuccess: () => props.setProcessing(false),
                onError: () => props.setProcessing(false),
              });
            }}
          >
            <TodayIcon className={props.classes.leftIcon} />
            {props.t('bookingModule.option.registerOption')}
          </Button>
        )}
      </div>
    );
  },
);

export class OfferBooking extends React.PureComponent<Props> {
  renderIsDisabled = () => {
    return (
      <div className={this.props.classes.innerContainer}>
        <BlockIcon className={this.props.classes.bigIcon} />
        <Typography className={this.props.classes.explainText}>
          {this.props.t('bookingModule.offer.isDisabled')}
        </Typography>
      </div>
    );
  };

  renderTooLate = () => {
    return (
      <div className={this.props.classes.innerContainer}>
        <BlockIcon className={this.props.classes.bigIcon} />
        <Typography className={this.props.classes.explainText}>
          {this.props.t('bookingModule.offer.isTooLate')}
        </Typography>
      </div>
    );
  };

  renderTooSoon = () => {
    return (
      <div className={this.props.classes.innerContainer}>
        <BlockIcon className={this.props.classes.bigIcon} />
        <Typography className={this.props.classes.explainText}>
          {this.props.t('bookingModule.offer.isTooSoon', {
            date: moment(this.props.offer.date_start)
              .add(
                this.props.offer.meta_activity.first_booking_minutes_until,
                'minutes',
              )
              .format('LL'),
          })}
        </Typography>
      </div>
    );
  };

  renderWaitingListFull = () => {
    return (
      <div className={this.props.classes.innerContainer}>
        <LockIcon className={this.props.classes.bigIcon} />
        <Typography className={this.props.classes.explainText}>
          {this.props.t('bookingModule.offer.isWaitingListFull')}
        </Typography>
      </div>
    );
  };

  render() {
    const {
      offer,
      classes,
      t,
      loading,
      bookingOptionListConvertible,
      bookingOptionListUnconvertible,
    } = this.props;
    const momentDate = moment(offer.date_start).tz(offer.establishment.tzname);
    const localDate = momentDate.format('LLLL');
    const localDateUpper =
      localDate[0].toUpperCase() + localDate.slice(1, localDate.length);

    const hasBookingOptionConvertible = !!bookingOptionListConvertible.length;
    const hasBookingOptionUnConvertible = !!bookingOptionListUnconvertible.length;

    const isAvailable = offer.available;
    const isTooLate = moment(offer.date_start)
      .add('minutes', -offer.meta_activity.last_booking_minutes)
      .isBefore(moment());
    const isTooSoon = !isOfferBookableYet(offer);
    const isBookable = isAvailable && !isTooLate && !isTooSoon;
    const isFull =
      offer.tot_slots >= offer.effectif && !hasBookingOptionConvertible;
    const isWaitingListFull =
      (offer.waiting_list_disabled || offer.is_waiting_list_full) &&
      (!hasBookingOptionUnConvertible && !hasBookingOptionConvertible);

    return (
      <div>
        <Typography className={classes.title} variant="h4">
          {localDateUpper}
        </Typography>
        <Paper>
          <OfferListItemConsumer offer={offer} />
          {this.props.hasRegistered && (
            <div className={classes.isRegisteredBanner}>
              <Typography>{t('bookingModule.hasRegistered')}</Typography>
            </div>
          )}
        </Paper>
        {!isAvailable ? this.renderIsDisabled() : null}
        {isAvailable && isTooLate ? this.renderTooLate() : null}
        {isAvailable && isTooSoon ? this.renderTooSoon() : null}
        {isBookable && isFull && !isWaitingListFull ? (
          <BookingOptionRegisterForm
            hasBookingOptionUnConvertible={hasBookingOptionUnConvertible}
            onClick={this.props.registerOption}
            t={this.props.t}
            classes={this.props.classes}
          />
        ) : null}
        {isBookable && isFull && isWaitingListFull
          ? this.renderWaitingListFull()
          : null}

        {isBookable && !isFull && loading ? (
          <div className={classes.innerContainer}>
            <CircularProgress />
          </div>
        ) : null}
        {isBookable && !isFull && !loading ? (
          <div>
            {this.props.consumerPaymentPackList.length ? (
              <div className={classes.section}>
                <Typography className={classes.sectionTitle} variant="h5">
                  {t('bookingModule.section.consumerPacks')}
                </Typography>
                <Paper>
                  {this.props.consumerPaymentPackList.map((cpp) => (
                    <ConsumerPaymentPackListItemCheckout
                      key={cpp.id}
                      noDivider
                      consumerPack={cpp}
                      offerId={offer.id}
                      creditPrice={offer.credit_price}
                      divider
                      onBookFromPack={(options) =>
                        this.props.bookWithConsumerPaymentPack(cpp.id, options)
                      }
                    />
                  ))}
                </Paper>
              </div>
            ) : null}
            {this.props.contractList.length ? (
              <div className={classes.section}>
                <Typography className={classes.sectionTitle} variant="h5">
                  {t('bookingModule.section.contracts')}
                </Typography>
                <Paper>
                  {this.props.contractList.map((c) => (
                    <SubscriptionContractListItem
                      contract={c}
                      onBook={() => this.props.buyContract(c)}
                      divider
                      key={c.id}
                    />
                  ))}
                </Paper>
              </div>
            ) : null}
            {this.props.comboList.length ? (
              <div className={classes.section}>
                <Typography className={classes.sectionTitle} variant="h5">
                  {t('bookingModule.section.paymentCombos')}
                </Typography>
                <Paper>
                  {this.props.comboList.map((pc) => (
                    <PaymentComboBuyableItem
                      key={pc.id}
                      paymentCombo={pc}
                      onClick={(options) =>
                        this.props.buyPaymentCombo(pc.id, options)
                      }
                    />
                  ))}
                </Paper>
              </div>
            ) : null}
            {this.props.paymentPackList.length ? (
              <div className={classes.section}>
                <Typography className={classes.sectionTitle} variant="h5">
                  {t('bookingModule.section.paymentPacks')}
                </Typography>
                <Paper>
                  {this.props.paymentPackList.map((pp) => (
                    <PaymentPackListItem
                      hidePacksNumber
                      showDuration
                      onBook={() => this.props.buyPaymentPack(pp.id)}
                      divider
                      key={pp.id}
                      pack={pp}
                    />
                  ))}
                </Paper>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  section: {
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing(4),
  },
  bigIcon: {
    height: 200,
    width: 200,
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  explainText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: 'white',
  },
  isRegisteredBanner: {
    color: 'green',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withTranslation(['booking']),
  withStyles(styles),
)(OfferBooking);
