import Immutable from 'seamless-immutable';

import actionTypes from '../actions/activity.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  all: [],
  loading: true,
  error: false,
  errorMsg: '',
});

export default function activityReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.HAS_FETCHED_ACTIVITIES:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.activities,
      });

    case actionTypes.START_FETCH_ACTIVITIES:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ACTIVITIES:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    default:
      return state;
  }
}
