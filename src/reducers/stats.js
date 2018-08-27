import Immutable from 'seamless-immutable';

import actionTypes from '../actions/stats.types';

const initialState = Immutable({
  activities: [],
  dashboard: {},
  dashboardLoading: true,
  lastUpdate: new Date(Date.now() - 60 * 60 * 1000),
  loading: true,
  error: false,
  errorMsg: '',
});

export default function statsReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.DASHBOARD_STATS_ALREADY_UP_TO_DATE:
      return Immutable.merge(state, {
        dashboardLoading: false,
      });
    case actionTypes.HAS_FETCHED_STATS_DASHBOARD:
      return Immutable.merge(state, {
        dashboard: action.dashboardStats,
        dashboardLoading: false,
      });
    case actionTypes.START_FETCH_STATS_DASHBOARD:
      return Immutable.merge(state, { dashboardLoading: true, error: false });
    case actionTypes.ERROR_FETCHING_STATS_DASHBOARD:
      return Immutable.merge(state, {
        dashboardLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.HAS_FETCHED_STATS_ACTIVITIES:
      return Immutable.merge(state, {
        lastUpdate: Date.now(),
        loading: false,
        error: false,
        activities: action.stats,
      });
    case actionTypes.START_FETCH_STATS_ACTIVITIES:
      return Immutable.merge(state, { loading: true, error: false });
    case actionTypes.ERROR_FETCHING_STATS_ACTIVITIES:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    default:
      return state;
  }
}
