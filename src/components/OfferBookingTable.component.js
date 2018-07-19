import React, { Component } from 'react';

import { connect } from 'react-redux';

import { booking as bookingActions } from '../actions';
import { BookingTable } from '../components';

type Props = {
  offerId: Number,
};

export class OfferBookingTable extends Component<Props> {
  componentDidMount() {
    this.props.fetchBookings(this.props.offerId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.offerId !== this.props.offerId) {
      this.props.fetchBookings(nextProps.offerId);
    }
  }

  render() {
    const { validatedBookings, pendingBookings } = this.props;
    return (
      <BookingTable
        pendingBookings={pendingBookings}
        validatedBookings={validatedBookings}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
  };
}

function mapStateToProps(state) {
  return {
    loading: state.booking.loading,
    validatedBookings: state.booking.validated,
    pendingBookings: state.booking.pending,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferBookingTable);
