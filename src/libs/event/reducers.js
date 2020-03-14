// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listEventActions } from './actions';
import { getEventState } from './selectors';

const initialState: SubscriptionState = Immutable({
  byIdentifier: {},
});

export default handleActions(
  {
    [listEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set(
          'loading',
          payload.loading,
        ),
      );
    },
    [listEventActions.setPage]: (state, { payload }) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('page', payload.page),
      );
    },
    [listEventActions.error]: (state, { payload }) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('error', payload.error),
      );
    },
    [listEventActions.success]: (state, { payload }) => {
      return state.setIn(
        ['byIdentifier', payload.identifier],
        getEventState(state, payload.identifier).set('items', payload.items),
      );
    },
  },
  initialState,
);
