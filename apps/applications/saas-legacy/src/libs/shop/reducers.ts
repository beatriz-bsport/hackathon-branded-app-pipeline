import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { PaginatedResponse } from '../../state/types';
// @ts-expect-error
import type { ShopState } from '../../state/shop/types';
import {
  shopItemAsManagerActions,
  shopItemBulkActions,
  shopItemAsConsumerActions,
  shopItemRetrieveActions,
  shopItemCreateOrUpdateActions,
  shopItemDeleteActions,
  shopItemFeaturedActions,
  shopItemDuplicateActions,
  isShopItemUsedInComboActions,
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
import type {
  IsShopUsedInComboAPI,
  Provision,
  ShopItem,
  SubShop,
  SubShopAPI,
} from './types';

const initialState: ShopState = Immutable({
  shopItem: {
    byId: {},
    featured: {
      loading: false,
      error: null,
      allIds: [],
    },
    duplicate: {
      loading: false,
      error: null,
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
      allIds: [],
      loading: false,
      error: null,
    },
    combo: {
      archivationWarning: {},
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
  loading: false,
  error: null,
});

export default handleActions(
  {
    [shopItemDuplicateActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'duplicate', 'loading'], payload);
    },
    [shopItemDuplicateActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'duplicate', 'error'], payload);
    },
    [shopItemFeaturedActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'featured', 'loading'], payload);
    },
    [shopItemFeaturedActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'featured', 'error'], payload);
    },
    [shopItemFeaturedActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state
        .setIn(
          ['shopItem', 'featured', 'allIds'],
          payload.map((si: ShopItem) => si.id),
        )
        .merge(
          {
            shopItem: {
              byId: payload.reduce(
                (acc: Record<number, ShopItem>, v: ShopItem) => ({
                  ...acc,
                  [v.id]: v,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [shopItemBulkActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'bulk', 'loading'], payload);
    },
    [shopItemBulkActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'bulk', 'error'], payload);
    },
    [shopItemBulkActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state.merge(
        {
          shopItem: {
            byId: payload.reduce(
              (acc: Record<number, ShopItem>, v: ShopItem) => ({
                ...acc,
                [v.id]: v,
              }),
              {},
            ),
            bulk: {
              allIds: payload.map((item: ShopItem) => item.id),
            },
          },
        },
        { deep: true },
      );
    },
    [shopItemAsManagerActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'asManager', 'loading'], payload);
    },
    [shopItemAsManagerActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'asManager', 'error'], payload);
    },
    [shopItemAsManagerActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state
        .setIn(
          ['shopItem', 'asManager', 'allIds'],
          payload.map((si: ShopItem) => si.id),
        )
        .merge(
          {
            shopItem: {
              byId: payload.reduce(
                (acc: Record<number, ShopItem>, v: ShopItem) => ({
                  ...acc,
                  [v.id]: v,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [shopItemAsConsumerActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'asConsumer', 'loading'], payload);
    },
    [shopItemAsConsumerActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'asConsumer', 'error'], payload);
    },
    [shopItemAsConsumerActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state
        .setIn(
          ['shopItem', 'asConsumer', 'allIds'],
          payload.map((si: ShopItem) => si.id),
        )
        .merge(
          {
            shopItem: {
              byId: payload.reduce(
                (acc: Record<number, ShopItem>, v: ShopItem) => ({
                  ...acc,
                  [v.id]: v,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [shopItemRetrieveActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem },
    ) => {
      return state.setIn(['shopItem', 'byId', payload.id], payload);
    },

    [provisionByShopItemActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: PaginatedResponse<Provision> },
    ) => {
      return state
        .setIn(['provision', 'items'], payload.results)
        .setIn(['provision', 'count'], payload.count)
        .setIn(['provision', 'page'], payload.page);
    },
    [provisionByShopItemActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['provision', 'loading'], payload);
    },
    [provisionByShopItemActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['provision', 'error'], payload);
    },

    [provisionCreateOrUpdateActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['provision', 'createOrUpdate', 'error'], payload);
    },
    [provisionCreateOrUpdateActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['provision', 'createOrUpdate', 'loading'], payload);
    },
    [provisionCreateOrUpdateActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: Provision },
    ) => {
      const { items } = state.provision;
      const idx = state.provision.items.findIndex(
        (p: Provision) => p.id === payload.id,
      );
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

    [shopItemCreateOrUpdateActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: ShopItem },
    ) => {
      return state.setIn(['shopItem', 'byId', payload.id], payload);
    },
    [shopItemCreateOrUpdateActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'createOrUpdate', 'error'], payload);
    },
    [shopItemCreateOrUpdateActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'createOrUpdate', 'loading'], payload);
    },
    [shopItemDeleteActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'delete_', 'error'], payload);
    },
    [shopItemDeleteActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'delete_', 'isLoading'], payload);
    },
    [shopItemDeleteActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: number },
    ) => {
      return state.setIn(
        ['shopItem', 'asManager', 'allIds'],
        state.shopItem.asManager.allIds.filter(
          (id_: number) => id_ !== payload,
        ),
      );
    },
    [subshopDeleteActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: number },
    ) => {
      return state.set(
        'subShops',
        state.subShops.filter((ss: SubShop) => ss.id !== payload),
      );
    },
    [subshopListActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => state.set('loading', payload),
    [subshopListActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => state.set('error', payload),
    [subshopListActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: SubShop[] },
    ) => {
      return state.set('subShops', payload);
    },
    [subShopCreateOrUpdateActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: SubShopAPI },
    ) => {
      if (state.subShops.find((ss: SubShop) => ss.id === payload.id)) {
        const idx = state.subShops.findIndex(
          (ss: SubShop) => ss.id === payload.id,
        );
        return state.setIn(['subShops', idx], payload);
      }
      return state.set('subShops', [...state.subShops, payload]);
    },
    [isShopItemUsedInComboActions.isLoading.toString()]: (
      state: ShopState,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItem', 'combo', 'loading'], payload);
    },
    [isShopItemUsedInComboActions.error.toString()]: (
      state: ShopState,
      { payload }: { payload: null | Error },
    ) => {
      return state.setIn(['shopItem', 'combo', 'error'], payload);
    },
    [isShopItemUsedInComboActions.success.toString()]: (
      state: ShopState,
      { payload }: { payload: IsShopUsedInComboAPI },
    ) => {
      return state.setIn(
        [
          'shopItem',
          'combo',
          'archivationWarning',
          payload.id,
          'used_in_combo',
        ],
        payload.is_used_in_payment_combo,
      );
    },
  },
  initialState,
);
