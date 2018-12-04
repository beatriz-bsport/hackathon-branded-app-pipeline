// @flow

import moment from 'moment';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  dateRangeChange,
  mainChartChange,
  statIsLoading,
  statLoaded,
  statError,
  statActivities,
} from '../actions/stats.actions';

import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  dateRange: {
    start: moment()
      .subtract(7, 'days')
      .valueOf(),
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
    [mainChartChange]: (state, { payload: { chart } }) => {
      return state.set('mainChart', chart);
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
    [statActivities.isLoading]: (state, { payload }) => {
      return state.setIn(['activities', 'loading'], payload);
    },
    [statActivities.error]: (state, { payload }) => {
      return state.setIn(['activities', 'error'], payload);
    },
    [statActivities.success]: (state, { payload }) => {
      return state
        .setIn(['activities', 'items'], payload)
        .setIn(['activities', 'lastUpdate'], new Date());
    },
  },
  initialState,
);
