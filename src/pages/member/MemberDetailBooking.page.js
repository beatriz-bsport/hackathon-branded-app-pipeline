// @flow

import React, { Component } from 'react';

import omit from 'lodash/omit';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';

import PaginatedListBase from '../../components/PaginatedListBase.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByMember as fetchBookingsByMemberAction,
  retrieveBooking,
} from '../../libs/booking/actions';
import { fetchOfferById as fetchOfferByIdAction } from '../../libs/offer/actions';

import { getDetailedOffer } from '../../libs/offer/selectors';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  updateCredit as updateCreditAction,
} from '../../libs/consumer-payment-pack/actions';

import type { Member } from '../../libs/member/types';
import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking } from '../../libs/booking/types';

import BookingItemForManagerV2 from '../../libs/booking/components/BookingItemForManagerV2.component';
import BookingDetail from '../../libs/booking/components/BookingDetail.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import BookingFilters from '../../libs/booking/components/BookingFilters.component';

import {
  getMemberBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
} from '../../libs/booking/selectors';
import { getMember } from '../../libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';

type Props = {
  id: number,
  timezone: string,
  bookingId: ?number,
  retrieveBooking: (number, OptionCallback) => void,
  retrieveConsumerPackBulk: (Array<number>) => void,
  member: Member,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingCurrentPage: number,
  fetchMemberBookingsList: (page: number, pageSize: number) => void,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  bookingsLoading: boolean,
  fetchMemberBookings: (id: number) => void,
  deleteBooking: (id: number, data: any, options: OptionCallback) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,

  selectBooking: (memberId: number, bookingId: number) => void,
  fetchOffer: (id: number) => void,
  goToOffer: (id: number) => void,
  getPass: (id: number) => void,
  selectedBooking: ?Booking,
  getPaymentPack: (id: number) => PaymentPack,
  offerLoading: boolean,
  member: Member,
  consumerPackLoading: boolean,
  offer: ?Offer,

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
};

type State = {
  bookingToRevert: ?Booking,
};

const BOOKING_PAGE_SIZE = 5;

export class MemberDetailBooking extends Component<Props, State> {
  state = {
    bookingToRevert: null,
  };

  componentDidMount() {
    if (this.props.bookingId) {
      this.fetchBookingDetails();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchMemberBookings(this.props.id, 1, 7, this.props.filters, {
        onSuccess: (bookings) =>
          this.props.retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
    }
    if (
      this.props.bookingId &&
      (!prevProps.bookingId || prevProps.bookingId !== this.props.bookingId)
    ) {
      this.fetchBookingDetails();
    }
  }

  fetchBookingDetails = () => {
    this.props.retrieveBooking(this.props.bookingId, {
      onSuccess: (booking) => {
        this.props.fetchOffer(booking.offer);
        this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]);
      },
    });
  };

  handleBookingDeletion = (data: any, options: OptionCallback) => {
    this.props.deleteBooking(this.state.bookingToRevert.id, data, options);
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
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <BookingFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
            />
            <Divider />
            <PaginatedListBase
              itemPerPage={BOOKING_PAGE_SIZE}
              loading={this.props.bookingsLoading}
              listProps={{ disablePadding: true }}
              items={this.props.bookings}
              nbItems={this.props.bookingCount}
              page={this.props.bookingCurrentPage}
              onPageRequested={(page, page_size) =>
                this.props.fetchMemberBookingsList(page, page_size)
              }
              renderItem={(b) => (
                <BookingItemForManagerV2
                  onClick={() => this.selectBooking(b)}
                  showRevertBookingButton
                  timezone={this.props.timezone}
                  button
                  selected={
                    this.props.selectedBooking &&
                    this.props.selectedBooking.id === b.id
                  }
                  key={b.id}
                  booking={b}
                  heading="date_start"
                  member={this.props.member}
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
              this.props.getPass(
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
            onOfferClick={this.props.goToOffer}
            offer={this.props.offer}
            offerLoading={
              !this.props.selectedBooking ||
              !this.props.offer ||
              this.props.selectedBooking.offer !== this.props.offer.id
            }
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
  withTranslation('booking'),
  withState('filters', 'setFilters', {}),
  withState('open', 'setOpen', {}),
  connect(
    (state, { id, bookingId }) => ({
      member: getMember(state, id),
      bookings: getMemberBookingListWithConsumerPack(state),
      selectedBooking: bookingId
        ? getMemberBookingWithConsumerPack(state, bookingId)
        : null,
      bookingCurrentPage: state.booking.byMember.page,
      bookingsLoading: state.booking.byMember.loading,
      bookingCount: state.booking.byMember.count,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      offer: getDetailedOffer(state),
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      getPass: (id_: number) => getConsumerPack(state, id_),
      timezone: state.theme.theme.timezone_name,
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      retrieveBooking,
      fetchOffer: fetchOfferByIdAction,

      deleteBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,

      incrementCredit: (id_) => updateCreditAction(id_, 1),
      decrementCredit: (id_) => updateCreditAction(id_, -1),

      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToConsumerPass: (memberId, consumerPassId) =>
        push(`/member/${memberId}/pass/${consumerPassId}/`),
      selectBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
    },
  ),
  withHandlers({
    setOpenValue: ({ setOpen, open }) => (name: string) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    fetchMemberBookingsList: ({
      id,
      filters,
      fetchMemberBookings,
      retrieveConsumerPackBulk,
    }) => (page, page_size) => {
      fetchMemberBookings(id, page, page_size, filters, {
        onSuccess: (bookings) =>
          retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
    },
    setFilterValue: ({ setFilters, filters }) => (name: string, value) => {
      if (value === null) {
        setFilters(omit(filters, name));
      } else {
        setFilters({
          ...filters,
          [name]: value,
        });
      }
    },
  }),
)(MemberDetailBooking);
