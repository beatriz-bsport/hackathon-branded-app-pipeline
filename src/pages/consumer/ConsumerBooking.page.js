// @flow
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsAsConsumer as fetchBookingsAsConsumerAction,
  retrieveBooking,
} from '../../libs/booking/actions';

import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';

import { getConsumerBookingListWithConsumerPack } from '../../libs/booking/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import { fetchPrivateBookings } from '../../libs/private-service/actions';

import ConsumerBookingPage from '../../libs/consumer-space/components/ConsumerBookingPage.component';

import type { Membership } from '../../libs/membership/types';
import type { Booking } from '../../libs/booking/types';
import type { PrivateBooking } from '../../libs/private-service/types';
import { urlToMarketplace } from '../../libs/marketplace/utils';

type Props = {
  membership: Membership,

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
      <ConsumerBookingPage
        membership={this.props.membership}
        bookings={this.props.bookings}
        bookingCount={this.props.bookingCount}
        bookingsLoading={this.props.bookingsLoading}
        bookingCurrentPage={this.props.bookingCurrentPage}
        fetchBookingList={this.props.fetchBookingList}
        cancelBooking={this.props.cancelBooking}
        privateBookingsLoading={this.props.privateBookingsLoading}
        private_booking_list={this.props.private_booking_list}
        fetchPrivateBookings={this.props.fetchPrivateBookings}
        goToCalendar={this.props.goToCalendar}
      />
    );
  }
}

export default compose(
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
      goToCalendar: (name, id) => push(urlToMarketplace(name, id)),
    },
  ),
  withHandlers({
    fetchBookingList: ({
      fetchBookingsAsConsumer,
      retrieveConsumerPackBulk,
      fetchPaymentPackBulk,
    }) => (member, page, page_size) =>
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
)(ConsumerBooking);
