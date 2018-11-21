// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/booking.types';
import authActionTypes from '../actions/auth.types';
import type { Booking, BookingOption } from '../api/types';

function updateBookings(
  booking: Booking,
  all: Array<Booking>,
): { all: Array<Booking> } {
  const cleanedOldAll = all.filter((b) => b.id !== booking.id);
  return {
    all: [booking, ...cleanedOldAll],
  };
}

function updateOptions(
  option: BookingOption,
  oldOptions: Array<BookingOption>,
): Array<BookingOption> {
  return [option, ...oldOptions.filter((o) => o.id !== option.id)].filter(
    (o) => !o.cancelled,
  );
}
const initialState = Immutable({
  loading: false,
  all: [],
  options: [],
  bookingsUpdating: [],
  bookingOptionsUpdating: [],
});

export default function bookingReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.ERROR_UPDATING_BOOKING_OPTION:
      return Immutable.merge(state, {
        bookingOptionsUpdating: state.bookingOptionsUpdating.filter(
          (id) => id !== action.bookingOptionId,
        ),
      });
    case actionTypes.START_UPDATING_BOOKING_OPTION:
      return Immutable.merge(state, {
        bookingOptionsUpdating: [
          action.bookingOptionId,
          ...state.bookingOptionsUpdating,
        ],
      });
    case actionTypes.BOOKING_OPTION_UPDATED: {
      return Immutable.merge(state, {
        options: updateOptions(action.bookingOption, state.options),
        bookingOptionsUpdating: state.bookingOptionsUpdating.filter(
          (id) => id !== action.bookingOptionId,
        ),
      });
    }

    case actionTypes.ERROR_UPDATING_BOOKING_STATUS:
      return Immutable.merge(state, {
        bookingsUpdating: state.bookingsUpdating.filter(
          (b) => b.id !== action.bookingId,
        ),
      });
    case actionTypes.START_UPDATING_BOOKING_STATUS:
      return Immutable.merge(state, {
        bookingsUpdating: [action.bookingId, ...state.bookingsUpdating],
      });
    case actionTypes.BOOKING_STATUS_UPDATED: {
      const { all } = updateBookings(action.booking, state.all);
      return Immutable.merge(state, {
        all,
        bookingsUpdating: state.bookingsUpdating.filter(
          (id) => id !== action.bookingId,
        ),
      });
    }

    case actionTypes.HAS_FETCHED_BOOKINGS: {
      const { bookings, booking_options } = action;
      return Immutable.merge(state, {
        all: bookings,
        loading: false,
        options: booking_options,
        bookingOptionsUpdating: [],
        bookingsUpdating: [],
      });
    }

    case actionTypes.START_FETCH_BOOKINGS:
      return Immutable.merge(state, {
        loading: true,
        all: [],
        options: [],
      });

    case actionTypes.ERROR_FETCHING_BOOKINGS:
      return Immutable.merge(state, {
        loading: false,
        all: [],
        options: [],
      });

    case actionTypes.BOOKING_ADD_SUCCESS: {
      return Immutable.merge(state, {
        all: [action.booking, ...state.all],
      });
    }

    case actionTypes.BOOKING_DELETE_ERROR:
    case actionTypes.BOOKING_DELETE_START:
      return state;
    case actionTypes.BOOKING_DELETE_SUCCESS: {
      return Immutable.merge(state, {
        all: state.all.filter((b) => b.id !== action.bookingId),
      });
    }

    default:
      return state;
  }
}
