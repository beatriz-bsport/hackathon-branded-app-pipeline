import Immutable from 'seamless-immutable';

import actionTypes from '../actions/meta-activity.types';

const initialState = Immutable({
  all: [],
  loading: true,
  error: false,
  errorMsg: '',
  metaActivity: null,
});

export default function activityReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_ACTIVITIES:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.activities,
      });

    case actionTypes.START_FETCH_ALL_ACTIVITIES:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ALL_ACTIVITIES:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.FETCHED_META_ACTIVITY_DETAILS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        metaActivity: action.metaActivity,
      });

    default:
      return state;
  }
}
