// @flow

import moment from 'moment-timezone';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

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
    start: moment().subtract(365, 'days').valueOf(),
    end: moment().valueOf(),
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
    // @ts-ignore
    [dateRangeChange]: (state, { payload: { start, end, kind } }) => {
      return state.set('dateRange', {
        start: start && start.valueOf(),
        end: end && end.valueOf(),
        kind,
      });
    },
    // @ts-ignore
    [statIsLoading]: (state, { payload: { identifier, loading } }) => {
      return state.setIn(['stats', identifier, 'isLoading'], loading);
    },
    // @ts-ignore
    [statLoaded]: (state, { payload: { identifier, data } }) => {
      return state.setIn(['stats', identifier, 'data'], data);
    },
    // @ts-ignore
    [statError]: (state, { payload: { identifier, error } }) => {
      return state.setIn(['stats', identifier, 'error'], error);
    },
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
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
        // @ts-ignore
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'loading'],
        // @ts-ignore
        payload.loading,
      );
    },
    [fetchDataSourceDashboardStatisticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-ignore
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'data'],
        // @ts-ignore
        payload.data,
      );
    },
  },
  initialState,
);
