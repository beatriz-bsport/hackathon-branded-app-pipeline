// @flow

import { createAction } from 'redux-actions';
import moment from 'moment';

import type { Dispatch, ThunkAction } from '../state/types';

import api from '../api';

export const dateRangeChange = createAction('STATISTICS/DATE_RANGE/CHANGE');
export const statIsLoading = createAction('STATISTICS/IS_LOADING');
export const statLoaded = createAction('STATISTICS/LOADED');
export const statError = createAction('STATISTICS/ERROR');

async function fetchStats(dispatch, identifier, callee) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = (await callee())
      .map((row) => {
        return { d: moment(row.d, 'YYYY-MM-DD').valueOf(), v: row.v };
      })
      .sort((u, v) => u.d - v.d);
    dispatch(statLoaded({ identifier, data }));
  } catch (error) {
    dispatch(statError({ identifier, error }));
  }
  dispatch(statIsLoading({ identifier, loading: false }));
}

export function fetchDashboard() {
  return async (dispatch: Dispatch) => {
    fetchStats(dispatch, 'bookings', api.stats.bookings);
    fetchStats(dispatch, 'newMembers', api.stats.newMembers);
    fetchStats(dispatch, 'turnover', api.stats.turnover);
  };
}

export const statActivities = {
  isLoading: createAction('STATISTICS/ACTIVITIES/IS_LOADING'),
  error: createAction('STATISTICS/ACTIVITIES/ERROR'),
  success: createAction('STATISTICS/ACTIVITIES/SUCCESS'),
};

function canUpdateStatActivities(lastDate) {
  return Date.now() - lastDate < 60 * 5 * 1000;
}
export function fetchStatActivities() {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(statActivities.isLoading(true));
    dispatch(statActivities.error(null));

    if (canUpdateStatActivities(getState().stats.activities.lastUpdate)) {
      try {
        const response = await api.stats.fetchActivities();
        dispatch(statActivities.success(response.data.results));
      } catch (err) {
        console.error(err);
        dispatch(statActivities.error(err));
      }
    }
    dispatch(statActivities.isLoading(false));
  };
}

export const smartListStats = {
  isLoading: createAction('STATISTICS/SMARTLIST/IS_LOADING'),
  error: createAction('STATISTICS/SMARTTLIST/ERROR'),
  resetData: createAction('STATISTICS/SMARTTLIST/RESET'),
  success: createAction('STATISTICS/SMARTLIST/SUCCESS'),
};

export function fetchSmartListStats(params: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    const { smartlist, statistic_identifier } = params;
    dispatch(
      smartListStats.isLoading({
        smartlist,
        statistic_identifier,
        isLoading: true,
      }),
    );
    dispatch(
      smartListStats.resetData({
        smartlist,
        statistic_identifier,
      }),
    );
    dispatch(smartListStats.error(null));

    try {
      const response = await api.stats.fetchSmartListStatsAPI(params);
      dispatch(
        smartListStats.success({
          smartlist,
          statistic_identifier,
          data: response.data.data,
          data_type: response.data.data_type,
        }),
      );
    } catch (error) {
      dispatch(smartListStats.error(error));
    }
    dispatch(
      smartListStats.isLoading({
        smartlist,
        statistic_identifier,
        isLoading: false,
      }),
    );
  };
}
