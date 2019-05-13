// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { detailActions, stopActions } from './actions';

import type { SubscriptionState } from './types';

const initialState: SubscriptionState = Immutable({
  items: {},
  detail: {
    loading: false,
    error: null,
  },
  stop: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [detailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [detailActions.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [stopActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stop', 'loading'], payload);
    },
    [stopActions.error]: (state, { payload }) => {
      return state.setIn(['stop', 'error'], payload);
    },
    [detailActions.success]: (state, { payload }) => {
      const { id } = payload;
      return state.merge({
        items: { [id]: payload },
      });
    },
  },
  initialState,
);
