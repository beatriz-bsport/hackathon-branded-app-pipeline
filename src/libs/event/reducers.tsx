// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listEventActions } from './actions';
import { getEventState } from './selectors';
import { EventState } from './types';

const initialState: Immutable.Immutable<EventState> = Immutable<EventState>({
  byIdentifier: {},
});

export default handleActions<Immutable.Immutable<EventState>>(
  {
    [listEventActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set(
          'loading',
          payload.loading,
        ),
      );
    },
    [listEventActions.setPage.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('page', payload.page),
      );
    },
    [listEventActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('error', payload.error),
      );
    },
    [listEventActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('items', payload.items),
      );
    },
  },
  initialState,
);
