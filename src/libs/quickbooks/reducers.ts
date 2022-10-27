import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  retrieveQuickbooksAppActions,
  quickbooksAppUpdateActions,
  revokeQuickbooksAppActions,
  requestQuickBooksAccessTokenActions,
  fetchTaxAgenciesActions,
  fetchTaxCodesActions,
  setTaxCodeActions,
} from './actions';

import type { QuickbooksState } from './types';

const initialState: Immutable.Immutable<QuickbooksState> =
  Immutable<QuickbooksState>({
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
    taxAgencies: {
      byId: {},
      loading: false,
      error: null,
    },
    taxCodes: {
      byId: {},
      loading: false,
      error: null,
      upsert: {
        loading: false,
        error: null,
      },
    },
  });

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

    [fetchTaxAgenciesActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['taxAgencies', 'byId'], payload);
    },
    [fetchTaxAgenciesActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['taxAgencies', 'error'], payload);
    },
    [fetchTaxAgenciesActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['taxAgencies', 'loading'], payload);
    },
    [fetchTaxCodesActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['taxCodes', 'byId'], payload);
    },
    [fetchTaxCodesActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['taxCodes', 'error'], payload);
    },
    [fetchTaxCodesActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['taxCodes', 'loading'], payload);
    },

    [setTaxCodeActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['taxCodes', 'upsert', 'error'], payload);
    },
    [setTaxCodeActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['taxCodes', 'upsert', 'loading'], payload);
    },
  },
  initialState,
);
