// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  detailActions,
  contractListActions,
  subscriptionForBookingActions,
  contractCreateOrUpdateActions,
  contractMarketplaceListActions,
  stopActions,
  listSubscriptionActions,
  byMemberSubscriptionActions,
  updateSubscriptionActions,
  freezeSubscriptionActions,
  switchPaymentPackActions,
  switchPaymentMethodActions,
  subscriptionBulkActions,
  subscriptionEventListActions,
} from './actions';

import type { SubscriptionState } from './types';

const initialState: SubscriptionState = Immutable({
  byId: {},
  createOrUpdate: {
    loading: false,
    error: null,
  },
  bulk: {
    loading: false,
    error: null,
  },
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
  freeze: {
    loading: false,
    error: null,
  },
  switchPaymentPack: {
    loading: false,
    error: null,
  },
  switchPaymentMethod: {
    loading: false,
    error: null,
  },

  events: {
    items: [],
    loading: false,
    error: null,
    page: 1,
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
    forBooking: {
      loading: false,
      error: null,
      allIds: [],
    },
  },
});

export default handleActions(
  {
    [subscriptionEventListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['events', 'loading'], payload);
    },
    [subscriptionEventListActions.setPage]: (state, { payload }) => {
      return state.setIn(['events', 'page'], payload);
    },
    [subscriptionEventListActions.error]: (state, { payload }) => {
      return state.setIn(['events', 'error'], payload);
    },
    [subscriptionEventListActions.success]: (state, { payload }) => {
      return state.setIn(['events', 'items'], payload);
    },
    [subscriptionBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bulk', 'loading'], payload);
    },
    [subscriptionBulkActions.error]: (state, { payload }) => {
      return state.setIn(['bulk', 'error'], payload);
    },
    [subscriptionBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        },
        {
          deep: true,
        },
      );
    },
    [subscriptionForBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'forBooking', 'loading'], payload);
    },
    [subscriptionForBookingActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'forBooking', 'error'], payload);
    },
    [subscriptionForBookingActions.reset]: (state) => {
      return state.setIn(['contract', 'forBooking', 'allIds'], []);
    },
    [subscriptionForBookingActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        )
        .setIn(['contract', 'forBooking', 'allIds'], payload.map((c) => c.id));
    },
    [switchPaymentMethodActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchPaymentMethod', 'loading'], payload);
    },
    [switchPaymentMethodActions.error]: (state, { payload }) => {
      return state.setIn(['switchPaymentMethod', 'error'], payload);
    },
    [switchPaymentMethodActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [switchPaymentPackActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchPaymentPack', 'loading'], payload);
    },
    [switchPaymentPackActions.error]: (state, { payload }) => {
      return state.setIn(['switchPaymentPack', 'error'], payload);
    },
    [switchPaymentPackActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [freezeSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['freeze', 'loading'], payload);
    },
    [freezeSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['freeze', 'error'], payload);
    },
    [freezeSubscriptionActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [updateSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updateSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updateSubscriptionActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
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
    [stopActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
  },
  initialState,
);
