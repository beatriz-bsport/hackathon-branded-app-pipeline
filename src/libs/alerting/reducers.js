// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listActions, detailActions, deleteActions } from './actions';

import type { AlertingState } from './types';

const initialState: AlertingState = Immutable({
  items: [],
  items_processing: [],
  loading: false,
  error: null,
});

export default handleActions(
  {
    [listActions.success]: (state, { payload }) => {
      return state.set('items', payload);
    },
    [listActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },

    [deleteActions.success]: (state, { payload }) => {
      return state.set('items', state.items.filter((al) => al.id !== payload));
    },
    [deleteActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [deleteActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },

    [detailActions.success]: (state, { payload }) => {
      return state.setIn(['items', payload.id], payload);
    },
    [detailActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [detailActions.isLoading]: (state, { payload }) => {
      if (payload.isLoading) {
        return state.set('items_processing', [
          ...state.items_processing,
          payload.id,
        ]);
      }
      return state.set(
        'items_processing',
        state.items_processing.filter((ip) => ip.id !== payload.id),
      );
    },
    [detailActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
