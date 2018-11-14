// @flow

import { createAction } from 'redux-actions';
import moment from 'moment';

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
  return async (dispatch) => {
    fetchStats(dispatch, 'bookings', api.stats.bookings);
    fetchStats(dispatch, 'newMembers', api.stats.newMembers);
    fetchStats(dispatch, 'turnover', api.stats.turnover);
  };
}
