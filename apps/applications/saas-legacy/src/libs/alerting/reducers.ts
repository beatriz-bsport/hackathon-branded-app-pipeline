import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import isEqual from 'lodash/isEqual';
import { listActions } from './actions';

import {
  AlertPayloadSuccess,
  AlertPayloadLoading,
  AlertingState,
} from './types';

const initialState: Immutable.Immutable<AlertingState> =
  Immutable<AlertingState>({
    items_by_kind: {},
    loading: false,
    error: null,
  });

export default handleActions<Immutable.Immutable<AlertingState>, any>(
  {
    [listActions.success.toString()]: (
      state,
      { payload }: { payload: AlertPayloadSuccess },
    ) => {
      let new_results = [];
      if (payload.page === 1) {
        new_results = payload.results;
      } else {
        new_results = [
          ...state.items_by_kind[payload.alert_kind].results,
          ...payload.results,
        ];
      }
      if (
        !isEqual(state.items_by_kind[payload.alert_kind].results, new_results)
      ) {
        return state
          .setIn(['items_by_kind', payload.alert_kind, 'results'], new_results)
          .setIn(['items_by_kind', payload.alert_kind, 'count'], payload.count)
          .setIn(
            ['items_by_kind', payload.alert_kind, 'next'],
            payload.next_page,
          );
      }
      return state
        .setIn(['items_by_kind', payload.alert_kind, 'count'], payload.count)
        .setIn(
          ['items_by_kind', payload.alert_kind, 'next'],
          payload.next_page,
        );
    },
    [listActions.isLoading.toString()]: (
      state,
      { payload }: { payload: AlertPayloadLoading },
    ) => {
      return state.set('loading', payload.isLoading);
    },
    [listActions.isLoading.toString()]: (
      state,
      { payload }: { payload: AlertPayloadLoading },
    ) => {
      return state.setIn(
        ['items_by_kind', payload.alert_kind, 'loading'],
        payload.isLoading,
      );
    },
    [listActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
