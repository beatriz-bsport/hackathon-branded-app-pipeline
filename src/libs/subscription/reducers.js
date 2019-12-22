// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  detailActions,
  contractListActions,
  contractCreateOrUpdateActions,
  contractMarketplaceListActions,
  stopActions,
  listSubscriptionActions,
  byMemberSubscriptionActions,
} from './actions';

import type { SubscriptionState } from './types';

const initialState: SubscriptionState = Immutable({
  byId: {},
  list: {
    loading: false,
    error: null,
    allIds: [],
  },
  byMember: {
    loading: false,
    error: null,
    allIds: [],
  },
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
    byMarketplace: {
      loading: false,
      error: null,
      allIds: [],
    },
  },
});

export default handleActions(
  {
    [listSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [listSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['list', 'error'], payload);
    },
    [listSubscriptionActions.success]: (state, { payload }) => {
      return state
        .setIn(['list', 'allIds'], payload.results.map((c) => c.id))
        .setIn(['list', 'count'], payload.count)
        .merge(
          {
            byId: payload.results.reduce(
              (acc, v) => ({ ...acc, [v.id]: v }),
              {},
            ),
          },
          { deep: true },
        );
    },
    [byMemberSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [byMemberSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['list', 'error'], payload);
    },
    [byMemberSubscriptionActions.success]: (state, { payload }) => {
      return state
        .setIn(['byMember', 'allIds'], payload.results.map((c) => c.id))
        .setIn(['byMember', 'count'], payload.count)
        .merge(
          {
            byId: payload.results.reduce(
              (acc, v) => ({ ...acc, [v.id]: v }),
              {},
            ),
          },
          { deep: true },
        );
    },

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
    [contractMarketplaceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'byMarketplace', 'loading'], payload);
    },
    [contractMarketplaceListActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'byMarketplace', 'error'], payload);
    },
    [contractMarketplaceListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['contract', 'byMarketplace', 'allIds'],
          payload.map((c) => c.id),
        )
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [detailActions.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [detailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [detailActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [stopActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stop', 'loading'], payload);
    },
    [stopActions.error]: (state, { payload }) => {
      return state.setIn(['stop', 'error'], payload);
    },
  },
  initialState,
);
