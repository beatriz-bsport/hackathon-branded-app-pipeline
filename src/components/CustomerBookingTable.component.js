import React, { Component } from 'react';

import { connect } from 'react-redux';

import { booking as bookingActions } from '../actions';
import { BookingTable } from '../components';

type Props = {
  consumerId: Number,
};

export class CustomerBookingTable extends Component<Props> {
  componentDidMount() {
    this.props.fetchBookings(this.props.consumerId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.consumerId !== this.props.consumerId) {
      this.props.fetchBookings(nextProps.consumerId);
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
    fetchBookings(consumerId) {
      dispatch(bookingActions.fetchBookingsByConsumer(consumerId));
    },
  };
}

function mapStateToProps(state) {
  return {
    loading: state.member.loading,
    validatedBookings: state.member.bookingsValidated,
    pendingBookings: state.member.bookingsPending,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CustomerBookingTable,
);
