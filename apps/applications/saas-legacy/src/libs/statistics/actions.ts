import { createAction } from 'redux-actions';
import { DateTime } from 'luxon';
import type { DataSourceDashboardGraph } from '#src/libs/dashboard/types';
// @ts-expect-error
import type { WaitingListStatisticsParams } from '#src/libs/statistics/types';
// @ts-expect-error
import type { Dispatch, ThunkAction } from '../state/types';

import {
  fetchBookingStatistics as fetchBookingStatisticsAPI,
  fetchOffersWaitingListStatistics as fetchOffersWaitingListStatisticsAPI,
  // @ts-expect-error
} from './api-deprecated';

import { fetchDataSourceDashboardStatistics as fetchDataSourceDashboardStatisticsAPI } from './api';

export const statIsLoading = createAction('STATISTICS/IS_LOADING');
export const statLoaded = createAction('STATISTICS/LOADED');
export const statError = createAction('STATISTICS/ERROR');

async function fetchStatsWithTime(
  dispatch: Dispatch,
  identifier: string,
  callee: (args: any) => void,
  params: any,
) {
  dispatch(statIsLoading({ identifier, loading: true }));
  dispatch(statError({ identifier, error: null }));

  try {
    const data = (await callee(params))
      // @ts-expect-error
      .map((row) => {
        return { d: DateTime.fromISO(row.d).toISO(), v: row.v };
      })
      // @ts-expect-error
      .sort((u, v) => u.d - v.d);
    dispatch(statLoaded({ identifier, data }));
  } catch (error) {
    dispatch(statError({ identifier, error }));
  }
  dispatch(statIsLoading({ identifier, loading: false }));
}

export function fetchOffersWaitingListStatistics(
  identifier: string,
  params: WaitingListStatisticsParams,
) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(
      dispatch,
      identifier,
      fetchOffersWaitingListStatisticsAPI,
      params,
    );
  };
}

export function fetchBookingStatistics(identifier: string, params: any) {
  return async (dispatch: Dispatch) => {
    fetchStatsWithTime(dispatch, identifier, fetchBookingStatisticsAPI, params);
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
