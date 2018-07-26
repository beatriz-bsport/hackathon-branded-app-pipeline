//@flow

import api from '../api';
import types from './activity.types';

export function fetchAllActivities() {
  return async (dispatch, getState) => {
    /*
    if (getState().activity.loading) {
      return dispatch(activityAlreadyLoading());
    }
    */
    dispatch(startFetchAllActivities());

    try {
      const response = await api.activity.fetchAllActivities();
      const activities = response.data;
      dispatch(fetchedAllActivities(activities));
    } catch (err) {
      dispatch(errorFetchingAllActivities());
    }
  };
}

export function fetchedAllActivities(activities) {
  return { type: types.HAS_FETCHED_ALL_ACTIVITIES, activities };
}
export function startFetchAllActivities() {
  return { type: types.START_FETCH_ALL_ACTIVITIES };
}

export function errorFetchingAllActivities() {
  return { type: types.ERROR_FETCHING_ALL_ACTIVITIES };
}
export function activityAlreadyLoading() {
  return { type: types.ACTIVITY_ALREADY_LOADING };
}

export function fetchMetaActivityDetails(id) {
  return async (dispatch, getState) => {
    dispatch(startFetchAllActivities());

    try {
      const response = await api.activity.fetchMetaActivityDetails(id);
      const metaActivity = response.data;
      dispatch(fetchedMetaActivityDetails(metaActivity));
    } catch (err) {
      dispatch(errorFetchingAllActivities());
    }
  };
}

export function fetchedMetaActivityDetails(metaActivity) {
  return { type: types.FETCHED_META_ACTIVITY_DETAILS, metaActivity };
}
