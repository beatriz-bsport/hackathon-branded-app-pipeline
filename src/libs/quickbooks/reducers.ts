import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  retrieveQuickbooksAppActions,
  quickbooksAppUpdateActions,
  revokeQuickbooksAppActions,
  requestQuickBooksAccessTokenActions,
} from './actions';

import type { QuickbooksState } from './types';

const initialState: Immutable.Immutable<QuickbooksState> = Immutable<QuickbooksState>(
  {
    loading: false,
    error: null,
    detail: {},
    update: {
      loading: false,
      error: null,
    },
    requestTooken: {
      loading: false,
      error: null,
    },
  },
);

export default handleActions(
  {
    [revokeQuickbooksAppActions.success.toString()]: (state) => {
      return state.set('detail', {});
    },
    [retrieveQuickbooksAppActions.success.toString()]: (state, { payload }) => {
      return state.set('detail', payload);
    },
    [retrieveQuickbooksAppActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [retrieveQuickbooksAppActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [quickbooksAppUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['update', 'error'], payload);
    },
    [quickbooksAppUpdateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['update', 'loading'], payload);
    },
    [requestQuickBooksAccessTokenActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['requestToken', 'error'], payload);
    },
    [requestQuickBooksAccessTokenActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['requestToken', 'loading'], payload);
    },
  },
  initialState,
);
