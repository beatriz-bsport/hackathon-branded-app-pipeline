import Immutable from 'seamless-immutable';

import actionTypes from '../actions/coach.types';

const initialState = Immutable({
  loading: false,
  error: '',
  selfCoach: null,
  companyAssociated: [],
  performance: null,
  performanceLoading: false,
  // Create or Update
  createOrUpdatePending: false,
  createOrUpdateError: null,
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

    case actionTypes.COACH_CREATE_OR_UPDATE:
      return state.merge({
        createOrUpdatePending: true,
      });

    case actionTypes.COACH_CREATE_OR_UPDATE_SUCCESS:
      return state.merge({
        createOrUpdatePending: false,
      });

    case actionTypes.COACH_CREATE_OR_UPDATE_ERROR:
      return state.merge({
        createOrUpdateError: action.error,
        createOrUpdatePending: false,
      });

    case actionTypes.COACH_UPDATE:
      return state.merge({
        updatedCoach: action.coach,
      });

    default:
      return state;
  }
}
