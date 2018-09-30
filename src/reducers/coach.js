import Immutable from 'seamless-immutable';

import actionTypes from '../actions/coach.types';

const initialState = Immutable({
  loading: false,
  error: '',
  selfCoach: null,
  companyAssociated: [],
  performance: null,
  performanceLoading: false,
});

export default function coachReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ASSOCIATED_COACH:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        companyAssociated: action.coaches,
      });

    case actionTypes.START_FETCH_ASSOCIATED_COACH:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ASSOCIATED_COACH:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.HAS_FETCHED_ASSOCIATED_COACH_PERFORMANCE:
      return Immutable.merge(state, {
        performanceLoading: false,
        performance: action.performance,
      });

    case actionTypes.START_FETCH_ASSOCIATED_COACH_PERFORMANCE:
      return Immutable.merge(state, { performanceLoading: true });

    case actionTypes.ERROR_FETCHING_ASSOCIATED_COACH_PERFORMANCE:
      return Immutable.merge(state, {
        performanceLoading: false,
        performance: null,
      });

    default:
      return state;
  }
}
