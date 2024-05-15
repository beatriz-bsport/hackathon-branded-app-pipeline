import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { DateTime } from 'luxon';
import {
  smartListStats,
  dateRangeChange,
  statIsLoading,
  statLoaded,
  statError,
  fetchDataSourceDashboardStatisticsActions,
} from './actions';

const initialState = Immutable({
  dateRange: {
    start: DateTime.now().minus({ years: 1 }).valueOf(),
    end: DateTime.now().valueOf(),
    kind: 'custom',
  },
  mainChart: 'turnover',
  stats: {},
  activities: {
    loading: false,
    error: null,
    items: [],
  },
  bySmartListId: {},
  dataSourceDashboard: {
    byUuid: {},
  },
});

export default handleActions(
  {
    // @ts-expect-error
    [dateRangeChange]: (state, { payload: { start, end, kind } }) => {
      return state.set('dateRange', {
        start: start && start.valueOf(),
        end: end && end.valueOf(),
        kind,
      });
    },
    // @ts-expect-error
    [statIsLoading]: (state, { payload: { identifier, loading } }) => {
      return state.setIn(['stats', identifier, 'isLoading'], loading);
    },
    // @ts-expect-error
    [statLoaded]: (state, { payload: { identifier, data } }) => {
      return state.setIn(['stats', identifier, 'data'], data);
    },
    // @ts-expect-error
    [statError]: (state, { payload: { identifier, error } }) => {
      return state.setIn(['stats', identifier, 'error'], error);
    },
    // @ts-expect-error
    [smartListStats.isLoading]: (state, { payload }) => {
      return state.setIn(
        [
          'bySmartListId',
          payload.smartlist,
          payload.statistic_identifier,
          'loading',
        ],
        payload.isLoading,
      );
    },
    // @ts-expect-error
    [smartListStats.resetData]: (state, { payload }) => {
      return state.setIn(
        [
          'bySmartListId',
          payload.smartlist,
          payload.statistic_identifier,
          'data',
        ],
        [],
      );
    },
    // @ts-expect-error
    [smartListStats.success]: (state, { payload }) => {
      return state.merge(
        {
          bySmartListId: {
            [payload.smartlist]: {
              [payload.statistic_identifier]: {
                data: payload.data,
                data_type: payload.data_type,
              },
            },
          },
        },
        { deep: true },
      );
    },
    [fetchDataSourceDashboardStatisticsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'loading'],
        // @ts-expect-error
        payload.loading,
      );
    },
    [fetchDataSourceDashboardStatisticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'data'],
        // @ts-expect-error
        payload.data,
      );
    },
  },
  initialState,
);
