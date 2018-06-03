import Immutable from 'seamless-immutable';

import actionTypes from '../actions/booking.types';

const initialState = Immutable({
  loading: false,
  validated: [],
  pending: [],
});

export default function bookingReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_BOOKINGS:
      const { pending_bookings, validated_bookings } = action.bookings;
      return Immutable.merge(state, {
        loading: false,
        validated: validated_bookings,
        pending: pending_bookings,
      });

    case actionTypes.START_FETCH_ALL_BOOKINGS:
      return Immutable.merge(state, {
        loading: true,
        validated: [],
        pending: [],
      });

    case actionTypes.ERROR_FETCHING_ALL_BOOKINGS:
      return Immutable.merge(state, {
        loading: false,
        validated: [],
        pending: [],
      });

    default:
      return state;
  }
}
