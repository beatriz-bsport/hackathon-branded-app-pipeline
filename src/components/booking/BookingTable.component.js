// @flow

import React, { Component } from 'react';

import { Typography, Grid, CircularProgress } from '@material-ui/core';
import { translate } from 'react-i18next';

import BookingItemForManager from './BookingItemForManager.component';
import BookingOptionForManager from './BookingOptionForManager.component';

type Props = {
  t: (x: string) => string,
  loading: boolean,
  heading: ?string,
  validatedBookings: Array<Object>,
  pendingBookings: Array<Object>,
  bookingOptions: Array<Object>,
  discardOption: (id: number) => void,
  bookingUpdaters: {
    discardBooking: (id: number) => void,
    discardBookingAttendance: (id: number) => void,
    confirmBooking: (id: number) => void,
    confirmBookingAttendance: (id: number) => void,
  },
};

export class BookingTable extends Component<Props> {
  render() {
    const {
      t,
      loading,
      heading,
      bookingOptions,
      validatedBookings,
      pendingBookings,
      discardOption,
      bookingUpdaters,
    } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    // prettier-ignore
    if (
      validatedBookings.length === 0
      && pendingBookings.length === 0
      && bookingOptions.length === 0
    ) {
      return (
        <Typography variant="caption">
          {t('booking.noBookingOnThisOffer')}
        </Typography>
      );
    }
    const {
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = bookingUpdaters;

    return (
      <Grid container direction="column" spacing={8} alignItems="stretch">
        {pendingBookings.map((b) => (
          <Grid item key={b.id}>
            <BookingItemForManager
              booking={b}
              key={b.id}
              heading={heading}
              bookingUpdaters={{
                confirmBooking: () => confirmBooking(b.id),
                discardBooking: () => discardBooking(b.id),
                discardBookingAttendance: () => discardBookingAttendance(b.id),
                confirmBookingAttendance: () => confirmBookingAttendance(b.id),
              }}
            />
          </Grid>
        ))}
        {validatedBookings.map((b) => (
          <Grid item key={b.id}>
            <BookingItemForManager
              heading={heading}
              booking={b}
              bookingUpdaters={{
                confirmBooking: () => confirmBooking(b.id),
                discardBooking: () => discardBooking(b.id),
                discardBookingAttendance: () => discardBookingAttendance(b.id),
                confirmBookingAttendance: () => confirmBookingAttendance(b.id),
              }}
            />
          </Grid>
        ))}
        {bookingOptions.map((bo) => (
          <Grid item key={bo.id}>
            <BookingOptionForManager
              option={bo}
              key={bo.id}
              discardOption={() => discardOption(bo.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default translate()(BookingTable);
