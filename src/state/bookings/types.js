// @flow

import type { Immutable } from 'seamless-immutable';
import type { Booking, BookingOption } from '../../api/types';

export type BookingsAction =
  | { type: null }
  | {
      type: 'BOOKING_OPTION_UPDATED',
      bookingOptionId: number,
      bookingOption: BookingOption,
    }
  | { type: 'START_UPDATING_BOOKING_OPTION', bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_OPTION', bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_STATUS', bookingId: number }
  | { type: 'START_UPDATING_BOOKING_STATUS', bookingId: number }
  | {
      type: 'BOOKING_STATUS_UPDATED',
      booking: Booking,
      bookingId: number,
    }
  | {
      type: 'HAS_FETCHED_BOOKINGS',
      bookings: Booking[],
      booking_options: Object,
    }
  | {
      type: 'START_FETCH_BOOKINGS',
    }
  | {
      type: 'ERROR_FETCHING_BOOKINGS',
    }
  | {
      type: 'BOOKING_ADD_SUCCESS',
      booking: Booking,
    }
  | {
      type: 'BOOKING_DELETE_SUCCESS',
      bookingId: number,
    }
  | {
      type: 'BOOKING_DELETE_ERROR',
    }
  | {
      type: 'BOOKING_DELETE_START',
    };
export type BookingsState = Immutable<{
  all: Booking[],
  bookingsUpdating: Booking[],
  options: BookingOption[],
  bookingOptionsUpdating: BookingOption[],
  loading: boolean,
}>;
