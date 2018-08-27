// @flow

import api from '../api';
import types from './stats.types';

export function fetchDashboard() {
  return async (dispatch, getState) => {
    dispatch(startFetchDashboard());

    /*
    if (Date.now() - getState().stats.dashboardLastUpdate < 60 * 5 * 1000) {
      return dispatch(dashboardAlreadyUpToDate());
    }
    */

    try {
      const response = await api.stats.fetchDashboard();
      const dashboardStats = response.data;
      dispatch(fetchedDashboard(dashboardStats));
    } catch (err) {
      dispatch(errorFetchingDashboard(err));
    }
  };
}

export function fetchedDashboard(dashboardStats) {
  return { type: types.HAS_FETCHED_STATS_DASHBOARD, dashboardStats };
}
export function startFetchDashboard() {
  return { type: types.START_FETCH_STATS_DASHBOARD };
}

export function errorFetchingDashboard(error) {
  return { type: types.ERROR_FETCHING_STATS_DASHBOARD, error };
}

export function dashboardAlreadyUpToDate() {
  return { type: types.DASHBOARD_STATS_ALREADY_UP_TO_DATE };
}

export function fetchActivities() {
  return async (dispatch, getState) => {
    dispatch(startFetchActivities());

    if (Date.now() - getState().stats.lastUpdate < 60 * 5 * 1000) {
      return dispatch(alreadyUpToDate());
    }

    try {
      const response = await api.stats.getActivities();
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
