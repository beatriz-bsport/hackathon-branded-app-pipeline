//@flow

import api from '../api';
import types from './activity.types';

export function startFetchActivities() {
  return { type: types.START_FETCH_ACTIVITIES };
}
export function errorFetchingActivities() {
  return { type: types.ERROR_FETCHING_ACTIVITIES };
}
export function fetchedActivities(activities) {
  return { type: types.HAS_FETCHED_ACTIVITIES, activities };
}
export function fetchActivities() {
  return async (dispatch, getState) => {
    dispatch(startFetchActivities());

    try {
      const response = await api.activity.fetchMinimal();
      const activities = response.data;
      dispatch(fetchedActivities(activities));
    } catch (err) {
      dispatch(errorFetchingActivities());
    }
  };
}
