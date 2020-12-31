// @flow

import { createAction } from 'redux-actions';
import moment from 'moment-timezone';

import type { Dispatch, ThunkAction } from '../state/types';

import api from '../api';
import {
  fetchBookingStatistics as fetchBookingStatisticsAPI,
  fetchBookingTimeslotStatistics as fetchBookingTimeslotStatisticsAPI,
  fetchMemberStatistics as fetchMemberStatisticsAPI,
  fetchPaymentStatistics as fetchPaymentStatisticsAPI,
  fetchPlannedInvoiceStatistics as fetchPlannedInvoiceStatisticsAPI,
  fetchBookingQualitative as fetchBookingQualitativeAPI,
  fetchInvoiceItemQualitative as fetchInvoiceItemQualitativeAPI,
} from '../api/stat';

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

async function fetchStatsWithTime(dispatch, identifier, callee, params) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = (await callee(params))
      .map((row) => {
        return { d: moment(row.d, 'YYYY-MM-DD HH').valueOf(), v: row.v };
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

export function fetchBookingStatistics(identifier: string, params: any) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(
      dispatch,
      identifier,
      api.stats.fetchBookingStatistics,
      params,
    );
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

async function fetchStatistics(
  dispatch: Dispatch,
  identifier: string,
  params: any,
  callee: (any) => void,
) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = await callee(params);
    dispatch(statLoaded({ identifier, data }));
  } catch (error) {
    console.error(error);
    dispatch(statError({ identifier, error }));
  }

  dispatch(statIsLoading({ identifier, loading: false }));
}

export function fetchBookingStatistics2(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(dispatch, identifier, params, fetchBookingStatisticsAPI);
  };
}

export function fetchBookingTimeslotStatistics(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(
      dispatch,
      identifier,
      params,
      fetchBookingTimeslotStatisticsAPI,
    );
  };
}

export function fetchMemberStatistics(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(dispatch, identifier, params, fetchMemberStatisticsAPI);
  };
}

export function fetchPaymentStatistics(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(dispatch, identifier, params, fetchPaymentStatisticsAPI);
  };
}

export function fetchPlannedInvoiceStatistics(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(
      dispatch,
      identifier,
      params,
      fetchPlannedInvoiceStatisticsAPI,
    );
  };
}

export function fetchBookingQualitative(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(dispatch, identifier, params, fetchBookingQualitativeAPI);
  };
}

export function fetchInvoiceItemQualitative(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(
      dispatch,
      identifier,
      params,
      fetchInvoiceItemQualitativeAPI,
    );
  };
}

export function fetchBookingTemporal(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(
      dispatch,
      identifier,
      params,
      api.stats.fetchBookingStatistics,
    );
  };
}
