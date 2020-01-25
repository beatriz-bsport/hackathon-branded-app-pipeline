// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TodayIcon from '@material-ui/icons/Today';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BookingCancellationDialog from './BookingCancellationDialog.component';
import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsAsConsumer as fetchBookingsAsConsumerAction,
  retrieveBooking,
} from '../../libs/booking/actions';

import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';

import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import BookingItemForManagerV2 from '../../libs/booking/components/BookingItemForManagerV2.component';

import { getConsumerBookingListWithConsumerPack } from '../../libs/booking/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';
import PaginatedListBase from '../../components/PaginatedListBase.component';

import PrivateBookingListItem from '../../libs/private-service/components/PrivateBookingListItem.component';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import { fetchPrivateBookings } from '../../libs/private-service/actions';

import type { Membership } from '../../libs/membership/types';
import type { Booking } from '../../libs/booking/types';
import type { PrivateBooking } from '../../libs/private-service/types';

const BOOKING_PAGE_SIZE = 10;

type Props = {
  t: TFunction,
  classes: Object,
  membership: Membership,

  setBookingToCancel: (?Booking) => void,
  bookingToCancel: ?Booking,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingsLoading: boolean,
  bookingCurrentPage: number,
  fetchBookingList: (member: number, page: number, page_size: number) => void,
  cancelBooking: (number) => void,

  privateBookingsLoading: boolean,
  private_booking_list: Array<PrivateBooking>,
  fetchPrivateBookings: ({ member: number }) => void,
  goToCalendar: (string, number) => void,
};

export class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({ member: this.props.membership.id });
  }

  render() {
    if (this.props.bookingsLoading && this.props.privateBookingsLoading) {
      return <LinearProgress />;
    }
    return (
      <div>
        <div className={this.props.classes.header}>
          <Button
            onClick={() =>
              this.props.goToCalendar(
                this.props.membership.company_name,
                this.props.membership.company,
              )
            }
            color="primary"
            variant="contained"
          >
            <TodayIcon className={this.props.classes.iconLeft} />
            {this.props.t('actions.goToCalendar')}
          </Button>
        </div>
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h3">
              {this.props.t('booking.titleBooking')}
            </Typography>
            <Divider className={this.props.classes.sectionDivider} />
            <Paper>
              <PaginatedListBase
                itemPerPage={BOOKING_PAGE_SIZE}
                loading={this.props.bookingsLoading}
                listProps={{ disablePadding: true }}
                items={this.props.bookings}
                nbItems={this.props.bookingCount}
                page={this.props.bookingCurrentPage}
                onPageRequested={(page, page_size) =>
                  this.props.fetchBookingList(
                    this.props.membership.id,
                    page,
                    page_size,
                  )
                }
                renderItem={(b) => (
                  <BookingItemForManagerV2
                    showRevertBookingButton={
                      b.booking_status_code === BOOKING_STATUS_OK.id &&
                      moment(b.offer_date_start).isAfter(moment())
                    }
                    disabled={b.booking_status_code !== BOOKING_STATUS_OK.id}
                    key={b.id}
                    booking={b}
                    heading="date_start"
                    member={this.props.membership.id}
                    handleRevert={() => this.props.setBookingToCancel(b)}
                  />
                )}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h3">
              {this.props.t('booking.titlePrivateBooking')}
            </Typography>
            <Divider className={this.props.classes.sectionDivider} />
            <Paper>
              <PaginatedListStateful
                itemPerPage={5}
                loading={this.props.privateBookingsLoading}
                listProps={{ disablePadding: true }}
                items={this.props.private_booking_list}
                renderItem={(b) => (
                  <PrivateBookingListItem
                    divider
                    key={b.id}
                    private_booking={b}
                  />
                )}
              />
            </Paper>
          </Grid>
          <BookingCancellationDialog
            open={this.props.bookingToCancel}
            booking={this.props.bookingToCancel}
            onCancel={() => this.props.setBookingToCancel(null)}
            onSubmit={() =>
              this.props.cancelBooking(this.props.bookingToCancel.id)
            }
          />
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  sectionDivider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  header: {
    display: 'flex',
    padding: theme.spacing.unit,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
  connect(
    (state) => ({
      bookings: getConsumerBookingListWithConsumerPack(state),
      bookingCurrentPage: state.booking.asConsumer.page,
      bookingsLoading: state.booking.asConsumer.loading,
      bookingCount: state.booking.asConsumer.count,
      consumerPackLoading: state.consumerPaymentPack.loading,
      getPass: (id_: number) => getConsumerPack(state, id_),

      private_booking_list: getPrivateBookingListBase(state),
      privateBookingsLoading: state.privateService.privateBooking.loading,
    }),
    {
      fetchBookingsAsConsumer: fetchBookingsAsConsumerAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      retrieveBooking,
      cancelBooking: cancelBookingAction,
      fetchPrivateBookings,

      deleteBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      goToCalendar: (name, id) => push(`/m/${name}/${id}`),
    },
  ),
  withState('bookingToCancel', 'setBookingToCancel', null),
  withProps(({ cancelBooking, setBookingToCancel }) => ({
    cancelBooking: (id, data) => {
      cancelBooking(id, data, { onSuccess: () => setBookingToCancel(null) });
    },
  })),
  withProps(
    ({
      fetchBookingsAsConsumer,
      retrieveConsumerPackBulk,
      fetchPaymentPackBulk,
    }) => ({
      fetchBookingList: (member, page, page_size) =>
        fetchBookingsAsConsumer(member, page, page_size, {
          onSuccess: (bookings) =>
            retrieveConsumerPackBulk(
              bookings.map((b) => b.consumer_payment_pack),
              {
                onSuccess: (consumerPacks) =>
                  fetchPaymentPackBulk(
                    consumerPacks.map((cpp) => cpp.payment_pack),
                  ),
              },
            ),
        }),
    }),
  ),
)(ConsumerBooking);
