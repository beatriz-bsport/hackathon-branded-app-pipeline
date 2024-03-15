import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';
import omit from 'lodash/omit';

import {
  fetchShopItemBaseListActions,
  fetchShopItemStandaloneListActions,
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

import {
  fetchSubshopListActions,
  createSubshopActions,
  updateSubshopActions,
  deleteSubshopActions,
} from './actions/subshopReworked';

import {
  fetchShopSupplierListActions,
  createShopSupplierActions,
  updateShopSupplierActions,
  deleteShopSupplierActions,
} from './actions/supplier';

import type { PaginatedResponse } from '../../state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemVariant,
  ShopStateReworked,
  ShopSupplier,
  SubShop,
} from '#libs/shop/types';

type PayloadReduceType<T> = { [id: number]: T };

const initialState: Immutable.Immutable<ShopStateReworked> =
  Immutable<ShopStateReworked>({
    shopItemReworked: {
      /** State for shop list related actions */
      duplicate: { error: null, loading: false },
      /** State for shop item details - only base/standalone items here */
      itemDetails: {
        error: null,
        loading: false,
        byId: {},
        updateDetails: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      /** State for shop item suppliers */
      suppliers: {
        error: null,
        loading: false,
        byId: {},
        allIds: [],
        create: { error: null, loading: false },
        updateSupplier: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      /** State for variants created from a base `ShopItem` */
      itemVariant: {
        error: null,
        loading: false,
        byBaseItemId: {},
        allIds: [],
        create: { error: null, loading: false },
        updateVariant: { error: null, loading: false },
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
      /** State for subshops */
      subshop: {
        error: null,
        loading: false,
        byId: {},
        allIds: [],
        create: { error: null, loading: false },
        updateSubshop: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      /** State for combo warnings per shop item ID  */
      usedInCombo: {
        error: null,
        loading: false,
        byId: {},
      },
    },
  });

export default handleActions<Immutable.Immutable<ShopStateReworked>, any>(
  {
    [fetchShopItemBaseListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItemReworked', 'itemBase', 'loading'], payload);
    },
    [fetchShopItemBaseListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemBase', 'error'], payload);
    },
    [fetchShopItemBaseListActions.success.toString()]: (
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
    [fetchShopItemStandaloneListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemStandalone', 'loading'],
        payload,
      );
    },
    [fetchShopItemStandaloneListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemStandalone', 'error'],
        payload,
      );
    },
    [fetchShopItemStandaloneListActions.success.toString()]: (
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
            itemDetails: { byId: { [payload.id]: payload } },
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
        ['shopItemReworked', 'usedInCombo', 'loading'],
        payload,
      );
    },
    [retrieveShopItemUsedInComboActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'usedInCombo', 'error'], payload);
    },
    [retrieveShopItemUsedInComboActions.success.toString()]: (
      state,
      { payload }: { payload: IsShopUsedInComboAPI },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'usedInCombo', 'byId', payload.id],
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
        ['shopItemReworked', 'itemDetails', 'updateDetails', 'loading'],
        payload,
      );
    },
    [updateShopItemActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemDetails', 'updateDetails', 'error'],
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
            itemDetails: { byId: { [payload.id]: payload } },
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
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'loading'],
        payload,
      );
    },
    [updateShopItemVariantBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'error'],
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
      { payload }: { payload: ShopSupplier },
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
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'loading'],
        payload,
      );
    },
    [createShopItemProvisionBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'error'],
        payload,
      );
    },
    [fetchSubshopListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItemReworked', 'subshop', 'loading'], payload);
    },
    [fetchSubshopListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'subshop', 'error'], payload);
    },
    [fetchSubshopListActions.success.toString()]: (
      state,
      { payload }: { payload: SubShop[] },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'subshop', 'allIds'],
          uniq(payload.map((subshop) => subshop.id)),
        )
        .merge(
          {
            shopItemReworked: {
              subshop: {
                byId: payload.reduce<PayloadReduceType<SubShop>>(
                  (acc, subshop) => {
                    acc[subshop.id] = subshop;
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
    [createSubshopActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'create', 'loading'],
        payload,
      );
    },
    [createSubshopActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'create', 'error'],
        payload,
      );
    },
    [createSubshopActions.success.toString()]: (
      state,
      { payload }: { payload: SubShop },
    ) => {
      return state
        .updateIn(['shopItemReworked', 'subshop', 'allIds'], (allIds) => [
          ...allIds,
          payload.id,
        ])
        .merge(
          {
            shopItemReworked: {
              subshop: { byId: { [payload.id]: payload } },
            },
          },
          { deep: true },
        );
    },
    [updateSubshopActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'updateSubshop', 'loading'],
        payload,
      );
    },
    [updateSubshopActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'updateSubshop', 'error'],
        payload,
      );
    },
    [updateSubshopActions.success.toString()]: (
      state,
      { payload }: { payload: SubShop },
    ) => {
      return state.merge(
        {
          shopItemReworked: {
            subshop: { byId: { [payload.id]: payload } },
          },
        },
        { deep: true },
      );
    },
    [deleteSubshopActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'delete', 'loading'],
        payload,
      );
    },
    [deleteSubshopActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'subshop', 'delete', 'error'],
        payload,
      );
    },
    [deleteSubshopActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'subshop', 'allIds'],
          state.shopItemReworked.subshop.allIds.filter(
            (id: number) => id !== payload,
          ),
        )
        .updateIn(['shopItemReworked', 'subshop', 'byId'], (subshopById) =>
          omit(subshopById, payload),
        );
    },
    [fetchShopSupplierListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['shopItemReworked', 'suppliers', 'loading'], payload);
    },
    [fetchShopSupplierListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'suppliers', 'error'], payload);
    },
    [fetchShopSupplierListActions.success.toString()]: (
      state,
      { payload }: { payload: ShopSupplier[] },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'suppliers', 'allIds'],
          payload.map((supplier) => supplier.id),
        )
        .merge(
          {
            shopItemReworked: {
              suppliers: {
                byId: payload.reduce<PayloadReduceType<ShopSupplier>>(
                  (acc, shopSupplier) => {
                    acc[shopSupplier.id] = shopSupplier;
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
    [createShopSupplierActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'create', 'loading'],
        payload,
      );
    },
    [createShopSupplierActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'create', 'error'],
        payload,
      );
    },
    [createShopSupplierActions.success.toString()]: (
      state,
      { payload }: { payload: ShopSupplier },
    ) => {
      const suppliersAllIds = state.shopItemReworked.suppliers.allIds;
      return state
        .setIn(
          ['shopItemReworked', 'suppliers', 'allIds'],
          [...suppliersAllIds, payload.id],
        )
        .merge(
          {
            shopItemReworked: {
              suppliers: { byId: { [payload.id]: payload } },
            },
          },
          { deep: true },
        );
    },
    [updateShopSupplierActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'updateSupplier', 'loading'],
        payload,
      );
    },
    [updateShopSupplierActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'updateSupplier', 'error'],
        payload,
      );
    },
    [updateShopSupplierActions.success.toString()]: (
      state,
      { payload }: { payload: ShopSupplier },
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
    [deleteShopSupplierActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'delete', 'loading'],
        payload,
      );
    },
    [deleteShopSupplierActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'suppliers', 'delete', 'error'],
        payload,
      );
    },
    [deleteShopSupplierActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state
        .setIn(
          ['shopItemReworked', 'suppliers', 'allIds'],
          state.shopItemReworked.suppliers.allIds.filter(
            (id: number) => id !== payload,
          ),
        )
        .updateIn(
          ['shopItemReworked', 'suppliers', 'byId'],
          (shopSuppliersById) => omit(shopSuppliersById, payload),
        );
    },
  },
  initialState,
);
