// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  detailActions,
  contractListActions,
  contractCreateOrUpdateActions,
  stopActions,
} from './actions';

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
  contract: {
    loading: false,
    error: null,
    byId: {},
    allIds: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [contractListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'loading'], payload);
    },
    [contractListActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'error'], payload);
    },
    [contractListActions.success]: (state, { payload }) => {
      return state
        .setIn(['contract', 'allIds'], payload.map((c) => c.id))
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [contractCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'createOrUpdate', 'loading'], payload);
    },
    [contractCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'createOrUpdate', 'error'], payload);
    },
    [contractCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['contract', 'byId', payload.id], payload);
    },
    [detailActions.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
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
