//@flow

import api from '../api';
import types from './stats.types';

export function fetchActivities() {
  return async (dispatch, getState) => {
    dispatch(startFetchActivities());

    if (Date.now() - getState().stats.lastUpdate < 60 * 5 * 1000) {
      return dispatch(alreadyUpToDate());
    }

    try {
      const response = await api.activity.getAllStats();
      const stats = response.data.results;
      dispatch(fetchedActivities(stats));
    } catch (err) {
      dispatch(errorFetchingActivities());
    }
  };
}

export function fetchedActivities(stats) {
  return { type: types.HAS_FETCHED_STATS_ACTIVITIES, stats };
}
export function startFetchActivities() {
  return { type: types.START_FETCH_STATS_ACTIVITIES };
}

export function errorFetchingActivities() {
  return { type: types.ERROR_FETCHING_STATS_ACTIVITIES };
}
export function alreadyUpToDate() {
  return { type: types.STATS_ALREADY_UP_TO_DATE };
}
