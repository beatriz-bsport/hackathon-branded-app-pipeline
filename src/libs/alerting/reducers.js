// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listActions, performActionAction, deleteActions } from './actions';

import type { AlertingState } from './types';

const initialState: AlertingState = Immutable({
  items_by_kind: {},
  items_processing: [],
  loading: false,
  error: null,
});

export default handleActions(
  {
    [listActions.success]: (state, { payload }) => {
      let new_results = [];
      if (payload.page === 1) {
        new_results = payload.results;
      } else {
        new_results = [
          ...state.items_by_kind[payload.alert_kind].results,
          ...payload.results,
        ];
      }
      return state
        .setIn(['items_by_kind', payload.alert_kind, 'results'], new_results)
        .setIn(['items_by_kind', payload.alert_kind, 'count'], payload.count)
        .setIn(
          ['items_by_kind', payload.alert_kind, 'next'],
          payload.next_page,
        );
    },
    [listActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload.isLoading);
    },
    [listActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['items_by_kind', payload.alert_kind, 'loading'],
        payload.isLoading,
      );
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

    [performActionAction.success]: (state, { payload }) => {
      return state.setIn(['items', payload.id], payload);
    },
    [performActionAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [performActionAction.isLoading]: (state, { payload }) => {
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
    [performActionAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
