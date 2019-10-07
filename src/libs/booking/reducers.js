// @flow

import Immutable from 'seamless-immutable';

import { actionTypes } from './actions';
import type { BookingsState, BookingsAction } from './types';

const initialState = Immutable({
  loading: false,
  all: [],
  options: [],
  bookingsUpdating: [],
  bookingOptionsUpdating: [],
});

export default function bookingReducers(
  state: BookingsState = initialState,
  action: BookingsAction = { type: null },
): BookingsState {
  switch (action.type) {
    case actionTypes.ERROR_UPDATING_BOOKING_OPTION: {
      const { bookingOptionId } = action;
      return state.set(
        'bookingOptionsUpdating',
        state.bookingOptionsUpdating.filter((id) => id !== bookingOptionId),
      );
    }
    case actionTypes.START_UPDATING_BOOKING_OPTION:
      return state.set('bookingOptionsUpdating', [
        action.bookingOptionId,
        ...state.bookingOptionsUpdating,
      ]);

    case actionTypes.BOOKING_OPTION_REGISTER_SUCCESS: {
      const { bookingOption } = action;
      return state.set('options', [...state.options, bookingOption]);
    }
    case actionTypes.BOOKING_OPTION_CANCELLED: {
      const { bookingOptionId } = action;
      return state
        .set('options', state.options.filter((o) => o.id !== bookingOptionId))
        .set(
          'bookingOptionsUpdating',
          state.bookingOptionsUpdating.filter((id) => id !== bookingOptionId),
        );
    }

    case actionTypes.ERROR_UPDATING_BOOKING_STATUS: {
      const { bookingId } = action;
      return state.set(
        'bookingsUpdating',
        state.bookingsUpdating.filter((b) => b.id !== bookingId),
      );
    }
    case actionTypes.START_UPDATING_BOOKING_STATUS: {
      const { bookingId } = action;
      return state.set('bookingsUpdating', [
        bookingId,
        ...state.bookingsUpdating,
      ]);
    }
    case actionTypes.BOOKING_STATUS_UPDATED: {
      const { booking, bookingId } = action;
      let idx = state.all.findIndex((b) => b.id === booking.id);
      if (idx === -1) {
        idx = state.all.length;
      }
      return state
        .setIn(['all', idx], booking)
        .set(
          'bookingsUpdating',
          state.bookingsUpdating.filter((id) => id !== bookingId),
        );
    }
    case actionTypes.HAS_FETCHED_BOOKINGS: {
      const { bookings, booking_options } = action;
      return state
        .set('all', bookings)
        .set('loading', false)
        .set('options', booking_options)
        .set('bookingOptionsUpdating', [])
        .set('bookingsUpdating', []);
    }

    case actionTypes.START_FETCH_BOOKINGS: {
      return state
        .set('loading', true)
        .set('all', [])
        .set('options', []);
    }

    case actionTypes.ERROR_FETCHING_BOOKINGS:
      return state.set('loading', false);

    case actionTypes.BOOKING_ADD_SUCCESS: {
      return state.set('all', [action.booking, ...state.all]);
    }

    case actionTypes.BOOKING_DELETE_ERROR:
    case actionTypes.BOOKING_DELETE_START:
      return state;
    case actionTypes.BOOKING_DELETE_SUCCESS: {
      const { bookingId } = action;
      return state.set('all', state.all.filter((b) => b.id !== bookingId));
    }

    default:
      return state;
  }
}
