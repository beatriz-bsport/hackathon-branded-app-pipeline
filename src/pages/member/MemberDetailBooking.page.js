// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  deleteBooking as deleteBookingAction,
  discardBookingAttendance as discardBookingAttendanceAction,
  confirmBookingAttendance as confirmBookingAttendanceAction,
  fetchBookingsByMember as fetchBookingsByMemberAction,
} from '../../libs/booking/actions';
import { fetchOfferById as fetchOfferByIdAction } from '../../actions/offer.actions';

import offerSelectors from '../../libs/offer/selectors';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  fetchById as fetchConsumerPackById,
  updateCredit as updateCreditAction,
} from '../../actions/consumer-payment-pack.actions';

import type { Member } from '../../libs/member/types';
import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking } from '../../libs/booking/types';

import BookingItemForManager from '../../libs/booking/components/BookingItemForManager.component';
import BookingDetail from '../../libs/booking/components/BookingDetail.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';

import bookingSelectors from '../../libs/booking/selectors';
import memberSelectors from '../../libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';
import consumerPaymentPackSelectors from '../../libs/consumer-payment-pack/selectors';

type Props = {
  id: number,
  member: Member,
  bookings: Array<Booking>,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  paymentPacks: Array<PaymentPack>,
  bookingsLoading: boolean,
  fetchMemberBookings: (id: number) => void,
  fetchMember: (id: number) => void,
  deleteBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,

  selectBooking: (memberId: number, bookingId: number) => void,
  fetchOffer: (id: number) => void,
  fetchConsumerPack: (id: number) => void,
  getConsumerPaymentPack: (id: number) => void,
  selectedBooking: ?Booking,
  getPaymentPack: (id: number) => PaymentPack,
  offerLoading: boolean,
  getOffer: (id: number) => Offer,
  member: Member,
  consumerPackLoading: boolean,
};

type State = {
  bookingToRevert: ?Booking,
};

export class MemberDetailBooking extends Component<Props, State> {
  state = { bookingToRevert: null };

  componentDidMount() {
    this.props.fetchMemberBookings(this.props.id);
    this.props.fetchMember(this.props.id);
    if (this.props.selectedBooking) {
      this.fetchBookingDetails();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.selectedBooking &&
      (!prevProps.selectedBooking ||
        prevProps.selectedBooking.id !== this.props.selectedBooking.id)
    ) {
      this.fetchBookingDetails();
    }
  }

  fetchBookingDetails = () => {
    this.props.fetchOffer(this.props.selectedBooking.offer);
    this.props.fetchConsumerPack(
      this.props.selectedBooking.consumer_payment_pack_id,
    );
  };

  handleBookingDeletion = () => {
    this.props.deleteBooking(this.state.bookingToRevert.id);
    this.setState({ bookingToRevert: null });
  };

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  selectBooking = (booking: Booking) => {
    this.props.selectBooking(this.props.id, booking.id);
  };

  render() {
    return (
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <PaginatedListStateful
              itemPerPage={5}
              loading={this.props.bookingsLoading}
              listProps={{ disablePadding: true }}
              items={this.props.bookings}
              renderItem={(b) => (
                <BookingItemForManager
                  onClick={() => this.selectBooking(b)}
                  showRevertBookingButton
                  button
                  selected={
                    this.props.selectedBooking &&
                    this.props.selectedBooking.id === b.id
                  }
                  key={b.id}
                  booking={b}
                  heading="date_start"
                  member={this.props.member}
                  paymentPacks={this.props.paymentPacks}
                  handleRevert={() => this.setState({ bookingToRevert: b })}
                  discardBookingAttendance={() =>
                    this.props.discardBookingAttendance(b.id)
                  }
                  confirmBookingAttendance={() =>
                    this.props.confirmBookingAttendance(b.id)
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <BookingDetail
            consumerPack={
              this.props.selectedBooking &&
              this.props.getConsumerPaymentPack(
                parseInt(
                  this.props.selectedBooking.consumer_payment_pack_id,
                  10,
                ),
              )
            }
            getPaymentPack={this.props.getPaymentPack}
            decrementCredit={this.props.decrementCredit}
            incrementCredit={this.props.incrementCredit}
            booking={this.props.selectedBooking}
            member={this.props.member}
            onConsumerPassSelected={this.goToConsumerPass}
            loading={this.props.consumerPackLoading || this.props.offerLoading}
            offer={this.props.getOffer(
              this.props.selectedBooking && this.props.selectedBooking.offer,
            )}
          />
        </Grid>
        <RevertBookingDialog
          handleBookingDeletion={this.handleBookingDeletion}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable
          closeRevertBookingDialog={() =>
            this.setState({ bookingToRevert: null })
          }
        />
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number', bookingId: 'bookingId:number' }),
  connect(
    (state, { id, bookingId }) => ({
      member: memberSelectors.get(state, id),
      bookings: bookingSelectors.getBookings(state),
      selectedBooking: bookingSelectors
        .getBookings(state)
        .find((b) => b.id === bookingId),
      bookingsLoading: state.booking.loading,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      getOffer: (id_: number) => offerSelectors.get(state, id_),
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      getConsumerPaymentPack: (id_: number) =>
        consumerPaymentPackSelectors.get(state, id_),
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      fetchConsumerPack: fetchConsumerPackById,
      fetchOffer: fetchOfferByIdAction,
      deleteBooking: deleteBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      goToConsumerPass: (memberId, consumerPassId) =>
        push(`/member/${memberId}/pass/${consumerPassId}/`),
      fetchMember: fetchMemberAction,
      incrementCredit: (id_) => updateCreditAction(id_, 1),
      decrementCredit: (id_) => updateCreditAction(id_, -1),
      selectBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
    },
  ),
)(MemberDetailBooking);
