import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listActions, performActionAction, deleteActions } from './actions';

import { AlertingState } from './types';

const initialState: Immutable.Immutable<AlertingState> = Immutable<AlertingState>({
  items_by_kind: {},
  items_processing: [],
  loading: false,
  error: null,
});

export default handleActions(
  {
    [listActions.success.toString()]: (state: any, { payload }: {payload: any}) => {
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
          payload.next_page
        );
    },
    [listActions.isLoading.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('loading', payload.isLoading);
    },
    [listActions.isLoading.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.setIn(
        ['items_by_kind', payload.alert_kind, 'loading'],
        payload.isLoading
      );
    },
    [listActions.error.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('error', payload);
    },

    [deleteActions.success.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('items', state.items.filter((al: any) => al.id !== payload));
    },
    [deleteActions.isLoading.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('loading', payload);
    },
    [deleteActions.error.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('error', payload);
    },

    [performActionAction.success.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.setIn(['items', payload.id], payload);
    },
    [performActionAction.error.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('error', payload);
    },
    [performActionAction.isLoading.toString()]: (state: any, { payload }: {payload: any}) => {
      if (payload.isLoading) {
        return state.set('items_processing', [
          ...state.items_processing,
          payload.id,
        ]);
      }
      return state.set(
        'items_processing',
        state.items_processing.filter((ip: any) => ip.id !== payload.id)
      );
    },
    [performActionAction.error.toString()]: (state: any, { payload }: {payload: any}) => {
      return state.set('error', payload);
    },
  },
  initialState
) as () => AlertingState;
