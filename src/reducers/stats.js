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
} from '../actions/stats.actions';

import authActionTypes from '../actions/auth.types';

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
});

export default handleActions(
  {
    [authActionTypes.DISCONNECT]: () => {
      return initialState;
    },
    [dateRangeChange]: (state, { payload: { start, end, kind } }) => {
      return state.set('dateRange', {
        start: start && start.valueOf(),
        end: end && end.valueOf(),
        kind,
      });
    },
    [statIsLoading]: (state, { payload: { identifier, loading } }) => {
      return state.setIn(['stats', identifier, 'isLoading'], loading);
    },
    [statLoaded]: (state, { payload: { identifier, data } }) => {
      return state.setIn(['stats', identifier, 'data'], data);
    },
    [statError]: (state, { payload: { identifier, error } }) => {
      return state.setIn(['stats', identifier, 'error'], error);
    },
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
  },
  initialState,
);
