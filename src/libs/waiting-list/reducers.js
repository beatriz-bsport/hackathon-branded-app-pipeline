// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { configurationDetail, configurationUpdate } from './actions';

import type { WaitingListState } from './types';

const initialState: WaitingListState = Immutable({
  configuration: {
    data: null,
    loading: false,
    error: null,
    update: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [configurationDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationDetail.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [configurationDetail.success]: (state, { payload }) => {
      return state.setIn(['configuration', 'data'], payload);
    },
    [configurationUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'update', 'loading'], payload);
    },
    [configurationUpdate.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'update', 'error'], payload);
    },
  },
  initialState,
);
