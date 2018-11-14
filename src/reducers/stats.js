// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  dateRangeChange,
  statIsLoading,
  statLoaded,
  statError,
} from '../actions/stats.actions';

import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  dateRange: { start: null, end: null },
  stats: {},
});

export default handleActions(
  {
    [authActionTypes.DISCONNECT]: () => {
      return initialState;
    },
    [dateRangeChange]: (state, { payload: { start, end } }) => {
      return state.setIn(['dateRange'], {
        start: start && start.valueOf(),
        end: end && end.valueOf(),
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
  },
  initialState,
);
