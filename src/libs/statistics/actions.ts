import { createAction } from 'redux-actions';
import { DateTime } from 'luxon';
// @ts-expect-error
import type { Dispatch, ThunkAction } from '../state/types';

import statsAPI, {
  fetchBookingStatistics as fetchBookingStatisticsAPI,
  fetchBookingTimeslotStatistics as fetchBookingTimeslotStatisticsAPI,
  fetchMemberStatistics as fetchMemberStatisticsAPI,
  fetchPaymentStatistics as fetchPaymentStatisticsAPI,
  fetchPlannedInvoiceStatistics as fetchPlannedInvoiceStatisticsAPI,
  fetchBookingQualitative as fetchBookingQualitativeAPI,
  fetchInvoiceItemQualitative as fetchInvoiceItemQualitativeAPI,
  // @ts-expect-error
} from './api-deprecated';

import { fetchDataSourceDashboardStatistics as fetchDataSourceDashboardStatisticsAPI } from './api';
import type { DataSourceDashboardGraph } from '#libs/dashboard/types';
// @ts-expect-error
import type { WaitingListStatisticsParams } from '#libs/statistics/types';

export const dateRangeChange = createAction('STATISTICS/DATE_RANGE/CHANGE');
export const statIsLoading = createAction('STATISTICS/IS_LOADING');
export const statLoaded = createAction('STATISTICS/LOADED');
export const statError = createAction('STATISTICS/ERROR');

// @ts-expect-error
async function fetchStats(dispatch, identifier, callee) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = (await callee())
      // @ts-expect-error
      .map((row) => {
        return { d: DateTime.fromISO(row.d).toMillis(), v: row.v };
      })
      // @ts-expect-error
      .sort((u, v) => u.d - v.d);
    dispatch(statLoaded({ identifier, data }));
  } catch (error) {
    dispatch(statError({ identifier, error }));
  }
  dispatch(statIsLoading({ identifier, loading: false }));
}
// @ts-expect-error
async function fetchStatsWithTime(dispatch, identifier, callee, params) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = (await callee(params))
      // @ts-expect-error
      .map((row) => {
        return { d: DateTime.fromISO(row.d).toMillis(), v: row.v };
      })
      // @ts-expect-error
      .sort((u, v) => u.d - v.d);
    dispatch(statLoaded({ identifier, data }));
  } catch (error) {
    dispatch(statError({ identifier, error }));
  }
  dispatch(statIsLoading({ identifier, loading: false }));
}

export function fetchDashboard() {
  return async (dispatch: Dispatch) => {
    fetchStats(dispatch, 'bookings', statsAPI.bookings);
    fetchStats(dispatch, 'newMembers', statsAPI.newMembers);
    fetchStats(dispatch, 'turnover', statsAPI.turnover);
  };
}

export function fetchBookingStatistics(identifier: string, params: any) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(
      dispatch,
      identifier,
      statsAPI.fetchBookingStatistics,
      params,
    );
  };
}

export function fetchOffersWaitingListStatistics(
  identifier: string,
  params: WaitingListStatisticsParams,
) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(
      dispatch,
      identifier,
      statsAPI.fetchOffersWaitingListStatistics,
      params,
    );
  };
}

export function fetchPrivateBookingStatistics(identifier: string, params: any) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(
      dispatch,
      identifier,
      statsAPI.fetchPrivateBookingStatistics,
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
      const response = await statsAPI.fetchSmartListStatsAPI(params);
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
  // @ts-expect-error
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
      statsAPI.fetchBookingStatistics,
    );
  };
}

export function fetchPrivateBookingTemporal(
  identifier: string,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    fetchStatistics(
      dispatch,
      identifier,
      params,
      statsAPI.fetchPrivateBookingStatistics,
    );
  };
}

// ------------------------------------
export const fetchDataSourceDashboardStatisticsActions = {
  isLoading: createAction('DATA_SOURCE_DASHBOARD/STATISTICS/IS_LOADING'),
  error: createAction('DATA_SOURCE_DASHBOARD/STATISTICS/ERROR'),
  success: createAction('DATA_SOURCE_DASHBOARD/STATISTICS/SUCCESS'),
};

export function fetchDataSourceDashboardStatistics(
  graph: DataSourceDashboardGraph,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchDataSourceDashboardStatisticsActions.error(null));
    dispatch(
      fetchDataSourceDashboardStatisticsActions.isLoading({
        uuid: graph.uuid,
        loading: true,
      }),
    );
    try {
      const response = await fetchDataSourceDashboardStatisticsAPI(graph);
      dispatch(
        fetchDataSourceDashboardStatisticsActions.success({
          uuid: graph.uuid,
          data: response.data,
        }),
      );
    } catch (err) {
      console.error(err);
      dispatch(fetchDataSourceDashboardStatisticsActions.error(err));
    }
    dispatch(
      fetchDataSourceDashboardStatisticsActions.isLoading({
        uuid: graph.uuid,
        loading: false,
      }),
    );
  };
}
