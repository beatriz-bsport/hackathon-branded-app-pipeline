// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { FranchiseState } from './types';
import { fetchFranchiseActions } from './actions';

const initialState: Immutable.Immutable<FranchiseState> = Immutable<FranchiseState>(
  {
    error: false,
    loading: false,
    franchissor: undefined,
  },
);

export default handleActions<Immutable.Immutable<FranchiseState>>(
  {
    // ME
    [fetchFranchiseActions.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseActions.error.toString()]: (state, payload) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseActions.success.toString()]: (state, { payload }: any) => {
      const { franchisor } = payload;

      return state
        .set('loading', false)
        .set('error', null)
        .set('franchissor', franchisor);
    },
  },
  initialState,
);
