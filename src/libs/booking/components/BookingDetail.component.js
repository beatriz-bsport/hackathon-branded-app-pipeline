// @flow
import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from '@material-ui/lab/Alert/Alert';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { formatAsDatetime } from '../../../utils/datetime';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

import type { Booking } from '../types';
import { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import { BookingSource, getStaffName } from '../utils';
import {
  BOOKING_CREATED_BY_STAFF,
  BOOKING_CANCELLED_BY_STAFF,
} from '#libs/booking/components/constants';

type Props = {
  classes: Object,
  t: TFunction,
  loading: boolean,
  booking: ?Booking,
  offer: Offer,
  onOfferClick: (offerId: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onConsumerPassSelected: (cpp: ConsumerPaymentPack) => void,
  offerLoading: boolean,
};

export class BookingDetail extends Component<Props> {
  render() {
    const { classes, t, booking } = this.props;
    const created_by = booking?.staff_history?.find(
      (sh) => sh?.action_identifier === BOOKING_CREATED_BY_STAFF,
    )?.staff;
    const cancelled_by = booking?.staff_history?.find(
      (sh) => sh?.action_identifier === BOOKING_CANCELLED_BY_STAFF,
    )?.staff;
    if (!this.props.booking) {
      return (
        <div className={classes.container}>
          <div className={classes.emptyMessageContainer}>
            <Alert className={classes.alertInfo} color="grey" severity="info">
              {t('details.pleaseSelectABooking')}
            </Alert>
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

            {!!created_by && (
              <div className={classes.parameter}>
                <Typography inline>{t('parameters.by')}:</Typography>
                <Typography inline>{getStaffName(created_by)}</Typography>
              </div>
            )}

            <div className={classes.parameter}>
              <Typography inline>{`${t('parameters.source')}: `}</Typography>
              <BookingSource source={booking.source} t={this.props.t} />
            </div>
            {booking.date_canceled && (
              <div className={classes.parameter}>
                <Typography inline>{t('parameters.cancelledOn')}:</Typography>
                <Typography inline>
                  {formatAsDatetime(booking.date_canceled)}
                </Typography>
              </div>
            )}
            {!!cancelled_by && (
              <div className={classes.parameter}>
                <Typography inline>{t('parameters.by')}:</Typography>
                <Typography inline>{getStaffName(cancelled_by)}</Typography>
              </div>
            )}
            {booking.is_no_show && (
              <div className={classes.parameter}>
                <Typography inline>{t('parameters.noShow')}:</Typography>
                <Typography inline>
                  {formatAsDatetime(booking.date_no_show_registered)}
                </Typography>
              </div>
            )}
          </div>
        </Paper>
        <Typography component="h3" variant="h6">
          {`${t('details.offerTitle')}`}
        </Typography>
        <Paper className={classes.paperContainer}>
          <OfferMinimalSummary
            loading={this.props.offerLoading}
            offer={this.props.offer}
            overrideClickAction={() =>
              this.props.onOfferClick(this.props.offer.id)
            }
          />
        </Paper>
        <Typography component="h3" variant="h6">
          {t('details.consumerPaymentPackTitle')}
        </Typography>
        {booking.consumer_payment_pack ? (
          <Paper className={classes.paperContainer}>
            <ConsumerPackRowItem
              hideConsumer
              consumerPack={booking.consumer_payment_pack}
              decrementCredit={() =>
                this.props.decrementCredit(booking.consumer_payment_pack.id)
              }
              incrementCredit={() =>
                this.props.incrementCredit(booking.consumer_payment_pack.id)
              }
              onClick={() =>
                this.props.onConsumerPassSelected(booking.consumer_payment_pack)
              }
              paymentPack={
                booking.consumer_payment_pack
                  ? booking.consumer_payment_pack.payment_pack
                  : null
              }
            />
          </Paper>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  parametersContainer: {
    padding: theme.spacing(2),
  },
  parameter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paperContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['booking']),
)(BookingDetail);
