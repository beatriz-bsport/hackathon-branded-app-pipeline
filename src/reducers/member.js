import Immutable from 'seamless-immutable';

import actionTypes from '../actions/member.types';

const initialState = Immutable({
  loading: true,
  all: [], // all the members
  pendingBookings: [], // specific to ONE member selected
  validatedBookings: [], // specific to ONE member selected
  member: {},
});

export default function memberReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_MEMBERS: {
      const all = action.members;
      return Immutable.merge(state, {
        all,
        loading: false,
      });
    }

    case actionTypes.START_FETCH_MEMBERS: {
      return Immutable.merge(state, {
        loading: true,
      });
    }
    case actionTypes.ERROR_FETCHING_MEMBERS: {
      return Immutable.merge(state, {
        loading: false,
      });
    }
    case actionTypes.HAS_FETCHED_MEMBER_BOOKINGS: {
      const { bookings } = action;
      return Immutable.merge(state, {
        pendingBookings: bookings.pending,
        validatedBookings: bookings.validated,
        loading: false,
      });
    }

    case actionTypes.START_FETCH_MEMBER:
      return Immutable.merge(state, {
        loading: true,
      });
    case actionTypes.ERROR_FETCHING_MEMBER:
      return Immutable.merge(state, {
        loading: false,
      });
    case actionTypes.HAS_FETCHED_MEMBER: {
      const { member } = action;
      return Immutable.merge(state, {
        member,
        loading: false,
      });
    }

    default:
      return state;
  }
}
