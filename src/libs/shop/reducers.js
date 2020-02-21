// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { ShopState } from '../../state/shop/types';
import {
  shopItemAsManagerActions,
  shopItemBulkActions,
  shopItemAsConsumerActions,
  shopItemRetrieveActions,
  shopItemCreateOrUpdateActions,
  shopItemDeleteActions,
  shopItemFeaturedActions,
} from './actions/shopitem';
import {
  provisionByShopItemActions,
  provisionCreateOrUpdateActions,
} from './actions/provision';
import {
  subshopDeleteActions,
  subshopListActions,
  subShopCreateOrUpdateActions,
} from './actions/subshop';

const initialState: ShopState = Immutable({
  shopItem: {
    byId: {},
    featured: {
      loading: false,
      error: null,
      allIds: [],
    },
    asConsumer: {
      loading: false,
      error: null,
      allIds: [],
    },
    createOrUpdate: {
      loading: false,
      error: null,
    },
    delete_: {
      isLoading: false,
      error: null,
    },
    asManager: {
      loading: false,
      error: null,
      allIds: [],
    },
    bulk: {
      loading: false,
      error: null,
    },
  },
  subShops: [],
  provision: {
    items: [],
    loading: false,
    count: 0,
    page: 1,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [shopItemFeaturedActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'featured', 'loading'], payload);
    },
    [shopItemFeaturedActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'featured', 'error'], payload);
    },
    [shopItemFeaturedActions.success]: (state, { payload }) => {
      return state
        .setIn(['shopItem', 'featured', 'allIds'], payload.map((si) => si.id))
        .merge(
          {
            shopItem: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [shopItemBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'bulk', 'loading'], payload);
    },
    [shopItemBulkActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'bulk', 'error'], payload);
    },
    [shopItemBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          shopItem: {
            byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
        },
        { deep: true },
      );
    },
    [shopItemAsManagerActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'asManager', 'loading'], payload);
    },
    [shopItemAsManagerActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'asManager', 'error'], payload);
    },
    [shopItemAsManagerActions.success]: (state, { payload }) => {
      return state
        .setIn(['shopItem', 'asManager', 'allIds'], payload.map((si) => si.id))
        .merge(
          {
            shopItem: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [shopItemAsConsumerActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'asConsumer', 'loading'], payload);
    },
    [shopItemAsConsumerActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'asConsumer', 'error'], payload);
    },
    [shopItemAsConsumerActions.success]: (state, { payload }) => {
      return state
        .setIn(['shopItem', 'asConsumer', 'allIds'], payload.map((si) => si.id))
        .merge(
          {
            shopItem: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [shopItemRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['shopItem', 'byId', payload.id], payload);
    },

    [provisionByShopItemActions.success]: (state, { payload }) => {
      return state
        .setIn(['provision', 'items'], payload.results)
        .setIn(['provision', 'count'], payload.count);
    },
    [provisionByShopItemActions.isLoading]: (state, { payload }) => {
      return state.setIn(['provision', 'loading'], payload);
    },
    [provisionByShopItemActions.error]: (state, { payload }) => {
      return state.setIn(['provision', 'error'], payload);
    },

    [provisionCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['provision', 'createOrUpdate', 'error'], payload);
    },
    [provisionCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['provision', 'createOrUpdate', 'loading'], payload);
    },
    [provisionCreateOrUpdateActions.success]: (state, { payload }) => {
      const { items } = state.provision;
      const idx = state.provision.items.findIndex((p) => p.id === payload.id);
      if (idx === -1 && state.provision.page === 1) {
        return state
          .setIn(['provision', 'loading'], false)
          .setIn(['provision', 'items'], [payload, ...items]);
      }
      if (idx > 0) {
        return state
          .setIn(['provision', 'loading'], false)
          .setIn(['provision', 'items', idx], payload);
      }
      return state.setIn(['provision', 'loading'], false);
    },

    [shopItemCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['shopItem', 'byId', payload.id], payload);
    },
    [shopItemCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'createOrUpdate', 'error'], payload);
    },
    [shopItemCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'createOrUpdate', 'loading'], payload);
    },
    [shopItemDeleteActions.error]: (state, { payload }) => {
      return state.setIn(['shopItem', 'delete_', 'error'], payload);
    },
    [shopItemDeleteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['shopItem', 'delete_', 'isLoading'], payload);
    },
    [shopItemDeleteActions.success]: (state, { payload }) => {
      return state.setIn(
        ['shopItem', 'asManager', 'allIds'],
        state.shopItem.asManager.allIds.filter((id_) => id_ !== payload),
      );
    },
    [subshopDeleteActions.success]: (state, { payload }) => {
      return state.set(
        'subShops',
        state.subShops.filter((ss) => ss.id !== payload),
      );
    },
    [subshopListActions.success]: (state, { payload }) => {
      return state.set('subShops', payload);
    },
    [subShopCreateOrUpdateActions.success]: (state, { payload }) => {
      if (state.subShops.find((ss) => ss.id === payload.id)) {
        const idx = state.subShops.findIndex((ss) => ss.id === payload.id);
        return state.setIn(['subShops', idx], payload);
      }
      return state.set('subShops', [...state.subShops, payload]);
    },
  },
  initialState,
);
