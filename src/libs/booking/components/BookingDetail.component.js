// @flow
import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';

import { formatAsDatetime } from '../../../datetime';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

import type { Booking } from '../types';
import { BookingSource } from '../utils';
// import type { Offer } from '../../libs/offer/types';

type Props = {
  classes: Object,
  t: TFunction,
  loading: boolean,
  booking: ?Booking,
  offer: Offer,
  onOfferClick: (offerId: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onConsumerPassSelected: (id: number) => void,
  offerLoading: boolean,
};

export class BookingDetail extends Component<Props> {
  render() {
    const { classes, t, booking } = this.props;
    if (!this.props.booking) {
      return (
        <div className={classes.container}>
          <div className={classes.emptyMessageContainer}>
            <InfoIcon fontSize="large" color="disabled" />
            <Typography
              className={classes.emptyMessageText}
              color="textSecondary"
              variant="caption"
            >
              {t('details.pleaseSelectABooking')}
            </Typography>
          </div>
        </div>
      );
    }

    if (this.props.loading) {
      return <LinearProgress />;
    }

    return (
      <div>
        <Typography component="h2" variant="h5">
          {t('details.title')}
        </Typography>
        <Paper className={classes.paperContainer}>
          <div className={classes.parametersContainer}>
            <div className={classes.parameter}>
              <Typography inline>{t('parameters.registeredOn')}:</Typography>
              <Typography inline>{formatAsDatetime(booking.date)}</Typography>
            </div>
            <div className={classes.parameter}>
              <Typography inline>{`${t('parameters.source')}: `}</Typography>
              <BookingSource t={this.props.t} source={booking.source} />
            </div>
          </div>
        </Paper>
        <Typography component="h3" variant="h6">
          {`${t('details.offerTitle')}`}
        </Typography>
        <Paper className={classes.paperContainer}>
          <OfferMinimalSummary
            loading={this.props.offerLoading}
            overrideClickAction={() =>
              this.props.onOfferClick(this.props.offer.id)
            }
            offer={this.props.offer}
          />
        </Paper>
        <Typography component="h3" variant="h6">
          {t('details.consumerPaymentPackTitle')}
        </Typography>
        {booking.consumer_payment_pack ? (
          <Paper className={classes.paperContainer}>
            <ConsumerPackRowItem
              consumerPack={booking.consumer_payment_pack}
              paymentPack={
                booking.consumer_payment_pack
                  ? booking.consumer_payment_pack.payment_pack
                  : null
              }
              onClick={() =>
                this.props.onConsumerPassSelected(
                  booking.consumer_payment_pack.id,
                )
              }
              hideConsumer
              incrementCredit={() =>
                this.props.incrementCredit(booking.consumer_payment_pack.id)
              }
              decrementCredit={() =>
                this.props.decrementCredit(booking.consumer_payment_pack.id)
              }
            />
          </Paper>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  parametersContainer: {
    padding: theme.spacing.unit * 2,
  },
  parameter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paperContainer: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 4,
  },
  emptyMessageText: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['booking']),
)(BookingDetail);
