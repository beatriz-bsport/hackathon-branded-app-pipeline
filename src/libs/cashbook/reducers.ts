import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { cashBookDetail, cashBookUpdate } from './actions';

import type { CashBook, CashBookState } from './types';

const initialState: Immutable.Immutable<CashBookState> =
  Immutable<CashBookState>({
    infos: {
      amount_received: 0,
      company_id: 0,
      company_name: '',
      date: '',
      date_last_update: '',
      today_end_amount: 0,
      today_start_amount: 0,
    },
    createOrUpdate: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
  });

export default handleActions<Immutable.Immutable<CashBookState>, any>(
  {
    [cashBookDetail.success.toString()]: (
      state,
      { payload }: { payload: CashBook },
    ) => {
      return state.set('infos', payload);
    },
    [cashBookDetail.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [cashBookDetail.error.toString()]: (
      state,
      { payload }: { payload: null | Error },
    ) => {
      return state.set('error', payload);
    },
    [cashBookUpdate.error.toString()]: (
      state,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [cashBookUpdate.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
  },
  initialState,
);
