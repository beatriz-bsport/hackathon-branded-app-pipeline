// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/booking.types';
import type { Booking, BookingOption } from '../api/types';

function updateBookings(
  booking: Booking,
  pendingBookings: Array<Booking>,
  validatedBookings: Array<Booking>,
): { validated: Array<Booking>, pending: Array<Booking> } {
  const cleanedOldPendings = pendingBookings.filter((b) => b.id !== booking.id);
  const cleanedOldValidated = validatedBookings.filter(
    (b) => b.id !== booking.id,
  );
  switch (booking.status) {
    case true:
      return {
        validated: [booking, ...cleanedOldValidated],
        pending: cleanedOldPendings,
      };
    case null:
      return {
        validated: cleanedOldValidated,
        pendingBookings: [booking, ...cleanedOldValidated],
      };
    default:
      return { pending: cleanedOldPendings, validated: cleanedOldValidated };
  }
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
  validated: [],
  pending: [],
  options: [],
  bookingsUpdating: [],
  bookingOptionsUpdating: [],
});

export default function bookingReducers(state = initialState, action = {}) {
  switch (action.type) {
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
      const { pending, validated } = updateBookings(
        action.booking,
        state.pending,
        state.validated,
      );
      return Immutable.merge(state, {
        pending,
        validated,
        bookingsUpdating: state.bookingsUpdating.filter(
          (id) => id !== action.bookingId,
        ),
      });
    }

    case actionTypes.HAS_FETCHED_BOOKINGS: {
      const {
        pending_bookings,
        validated_bookings,
        booking_options,
      } = action.bookings;
      return Immutable.merge(state, {
        loading: false,
        validated: validated_bookings,
        pending: pending_bookings,
        options: booking_options,
        bookingOptionsUpdating: [],
      });
    }

    case actionTypes.START_FETCH_BOOKINGS:
      return Immutable.merge(state, {
        loading: true,
        validated: [],
        pending: [],
        options: [],
      });

    case actionTypes.ERROR_FETCHING_BOOKINGS:
      return Immutable.merge(state, {
        loading: false,
        validated: [],
        pending: [],
        options: [],
      });

    default:
      return state;
  }
}
