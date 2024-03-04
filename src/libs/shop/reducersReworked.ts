import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import {
  retrieveShopItemBaseListActions,
  retrieveShopItemStandaloneListActions,
  retrieveShopItemDetailsActions,
  retrieveShopItemUsedInComboActions,
  fetchShopItemVariantListActions,
  createShopItemActions,
  createShopItemVariantsActions,
  updateShopItemActions,
  updateShopItemVariantBulkActions,
  deleteShopItemActions,
  deleteShopItemVariantActions,
  retrieveShopItemSupplierActions,
  createShopItemProvisionBulkActions,
} from './actions/shopItemReworked';

import type { PaginatedResponse } from '../../state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemVariant,
  ShopStateReworked,
  ShopItemSupplier,
} from '#libs/shop/types';

type PayloadReduceType<T> = { [id: number]: T };

const initialState: Immutable.Immutable<ShopStateReworked> =
  Immutable<ShopStateReworked>({
    shopItemReworked: {
      /** State for shop item details - only base/standalone items here */
      itemDetails: {
        error: null,
        loading: false,
        byId: {},
        update: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      /** State for shop item suppliers */
      suppliers: {
        byId: {},
        error: null,
        loading: false,
      },
      /** State for variants created from a base `ShopItem` */
      itemVariant: {
        error: null,
        loading: false,
        byBaseItemId: {},
        allIds: [],
        create: { error: null, loading: false },
        update: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      /** State for base items that can have variants */
      itemBase: {
        error: null,
        loading: false,
        byId: {},
        allIds: [],
        create: { error: null, loading: false },
      },
      /** State for items that have no variants */
      itemStandalone: {
        error: null,
        loading: false,
        byId: {},
        allIds: [],
      },
    },
  });

export default handleActions<Immutable.Immutable<ShopStateReworked>, any>(
  {
    [retrieveShopItemBaseListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItemReworked', 'itemBase', 'loading'], payload);
    },
    [retrieveShopItemBaseListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemBase', 'error'], payload);
    },
    [retrieveShopItemBaseListActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'itemBase', 'allIds'],
          uniq(payload.map((shopItemBase) => shopItemBase.id)),
        )
        .merge(
          {
            shopItemReworked: {
              itemBase: {
                byId: payload.reduce<PayloadReduceType<ShopItem>>(
                  (acc, shopItemBase) => {
                    acc[shopItemBase.id] = shopItemBase;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [retrieveShopItemStandaloneListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemStandalone', 'loading'],
        payload,
      );
    },
    [retrieveShopItemStandaloneListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemStandalone', 'error'],
        payload,
      );
    },
    [retrieveShopItemStandaloneListActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItem[] },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'itemStandalone', 'allIds'],
          uniq(payload.map((shopItemStandalone) => shopItemStandalone.id)),
        )
        .merge(
          {
            shopItemReworked: {
              itemStandalone: {
                byId: payload.reduce<PayloadReduceType<ShopItem>>(
                  (acc, shopItemStandalone) => {
                    acc[shopItemStandalone.id] = shopItemStandalone;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [retrieveShopItemDetailsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'loading'],
        payload,
      );
    },
    [retrieveShopItemDetailsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemDetails', 'error'], payload);
    },
    [retrieveShopItemDetailsActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItem },
    ) => {
      return state.merge(
        {
          shopItemReworked: {
            itemDetails: { byId: { [payload.id]: { item: payload } } },
          },
        },
        { deep: true },
      );
    },
    [retrieveShopItemUsedInComboActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'loading'],
        payload,
      );
    },
    [retrieveShopItemUsedInComboActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemDetails', 'error'], payload);
    },
    [retrieveShopItemUsedInComboActions.success.toString()]: (
      state,
      { payload }: { payload: IsShopUsedInComboAPI },
    ) => {
      return state.setIn(
        [
          'shopItemReworked',
          'itemDetails',
          'byId',
          payload.id,
          'isUsedInCombo',
        ],
        payload.is_used_in_payment_combo,
      );
    },
    [fetchShopItemVariantListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'loading'],
        payload,
      );
    },
    [fetchShopItemVariantListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemVariant', 'error'], payload);
    },
    [fetchShopItemVariantListActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          data: PaginatedResponse<ShopItemVariant>;
          baseItemId: number;
        };
      },
    ) => {
      const { next_page, count, page, results } = payload.data;
      return state.setIn(
        [
          'shopItemReworked',
          'itemVariant',
          'byBaseItemId',
          `${payload.baseItemId}`,
        ],
        {
          next_page,
          page,
          count,
          variants: results,
        },
      );
    },
    [createShopItemActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemBase', 'create', 'loading'],
        payload,
      );
    },
    [createShopItemActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemBase', 'create', 'error'],
        payload,
      );
    },
    [createShopItemVariantsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'create', 'loading'],
        payload,
      );
    },
    [createShopItemVariantsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'create', 'error'],
        payload,
      );
    },
    [updateShopItemActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'update', 'loading'],
        payload,
      );
    },
    [updateShopItemActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'update', 'error'],
        payload,
      );
    },
    [updateShopItemActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItem },
    ) => {
      return state.merge(
        {
          shopItemReworked: {
            itemDetails: { byId: { [payload.id]: { item: payload } } },
          },
        },
        { deep: true },
      );
    },
    [updateShopItemVariantBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'update', 'loading'],
        payload,
      );
    },
    [updateShopItemVariantBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'update', 'error'],
        payload,
      );
    },
    [deleteShopItemActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'delete', 'loading'],
        payload,
      );
    },
    [deleteShopItemActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'delete', 'error'],
        payload,
      );
    },
    [deleteShopItemVariantActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'delete', 'loading'],
        payload,
      );
    },
    [deleteShopItemVariantActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'delete', 'error'],
        payload,
      );
    },
    [retrieveShopItemSupplierActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItemReworked', 'suppliers', 'loading'], payload);
    },
    [retrieveShopItemSupplierActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'suppliers', 'error'], payload);
    },
    [retrieveShopItemSupplierActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItemSupplier },
    ) => {
      return state.merge(
        {
          shopItemReworked: {
            suppliers: { byId: { [payload.id]: payload } },
          },
        },
        { deep: true },
      );
    },
    [createShopItemProvisionBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'update', 'loading'],
        payload,
      );
    },
    [createShopItemProvisionBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'update', 'error'],
        payload,
      );
    },
  },
  initialState,
);
