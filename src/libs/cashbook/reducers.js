// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { cashBookDetail, cashBookUpdate } from './actions';

import type { CashBook } from './types';

const initialState: CashBook = Immutable({
  infos: {
    today_start_amount: null,
    today_end_amount: null,
    date_last_update: null,
  },
  createOrUpdate: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions(
  {
    [cashBookDetail.success]: (state, { payload }) => {
      return state.set('infos', payload);
    },
    [cashBookDetail.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [cashBookDetail.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [cashBookUpdate.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [cashBookUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
  },
  initialState,
);
