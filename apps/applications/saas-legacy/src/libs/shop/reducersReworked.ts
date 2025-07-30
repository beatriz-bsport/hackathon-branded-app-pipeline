import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';
import omit from 'lodash/omit';

import type { PaginatedResponse } from '#src/state/types';
import type {
  IsShopUsedInComboAPI,
  Provision,
  ShopItem,
  ShopItemBarcodeUnicity,
  ShopItemTemplate,
  ShopItemVariantCombination,
  ShopStateReworked,
  ShopSupplier,
  ShopSupplierTemplate,
  SubShop,
  SubshopTemplate,
} from '#src/libs/shop/types';
import {
  fetchShopItemBaseListActions,
  fetchShopItemStandaloneListActions,
  retrieveShopItemDetailsActions,
  retrieveShopItemBarcodeUnicityActions,
  retrieveShopItemUsedInComboActions,
  fetchShopItemVariantListActions,
  createShopItemActions,
  createShopItemVariantsActions,
  updateShopItemActions,
  updateShopItemVariantBulkActions,
  updateShopItemTemplateVariantBulkActions,
  deleteShopItemActions,
  deleteShopItemVariantActions,
  createShopItemProvisionActions,
  createShopItemProvisionBulkActions,
  fetchShopItemVariantCombinationListActions,
  fetchShopItemTemplateVariantCombinationListActions,
  retrieveShopItemTemplateDetailsActions,
  fetchShopItemTemplateListActions,
  deleteShopItemTemplateActions,
  updateShopItemTemplateActions,
  createShopItemTemplateActions,
  fetchShopItemTemplateVariantListActions,
  fetchShopItemTemplateInstanceListActions,
  createShopItemTemplateVariantsActions,
} from './actions/shopItemReworked';

import {
  fetchSubshopListActions,
  createSubshopActions,
  updateSubshopActions,
  deleteSubshopActions,
  fetchSubshopTemplateListActions,
  createSubshopTemplateActions,
  updateSubshopTemplateActions,
  deleteSubshopTemplateActions,
} from './actions/subshopReworked';

import {
  retrieveShopItemSupplierActions,
  fetchShopSupplierListActions,
  createShopSupplierActions,
  updateShopSupplierActions,
  deleteShopSupplierActions,
  fetchShopSupplierTemplateListActions,
  createShopSupplierTemplateActions,
  updateShopSupplierTemplateActions,
  deleteShopSupplierTemplateActions,
} from './actions/supplier';

type PayloadReduceType<T> = { [id: number]: T };

const initialState: Immutable.Immutable<ShopStateReworked> =
  Immutable<ShopStateReworked>({
    shopItemReworked: {
      /** State for shop list related actions */
      duplicate: { error: null, loading: false },
      /** State for checking a barcode unicity */
      barcodeUnicity: { error: null, loading: false },
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
        count: 0,
        next_page: 1,
        page: 1,
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
    /* Franchisor shop state */
    shopTemplates: {
      subshopTemplate: {
        error: null,
        loading: false,
        count: 0,
        next_page: 1,
        page: 1,
        byId: {},
        allIds: [],
        create: { error: null, loading: false },
        updateSubshopTemplate: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      shopItemTemplate: {
        bySubshopTemplateId: {},
        itemDetails: {
          error: null,
          loading: false,
          byId: {},
          updateDetails: { error: null, loading: false },
          delete: { error: null, loading: false },
        },
        itemVariant: {
          error: null,
          loading: false,
          create: { error: null, loading: false },
          updateVariant: { error: null, loading: false },
          delete: { error: null, loading: false },
          byBaseItemTemplateId: {},
        },
        itemInstance: {
          error: null,
          loading: false,
          byBaseItemTemplateId: {},
        },
        create: { error: null, loading: false },
        updateShopItemTemplate: { error: null, loading: false },
        delete: { error: null, loading: false },
      },
      supplierTemplate: {
        error: null,
        loading: false,
        count: 0,
        next_page: 1,
        page: 1,
        byId: {},
        allIds: [],
        create: { error: null, loading: false },
        updateSupplierTemplate: { error: null, loading: false },
        delete: { error: null, loading: false },
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
                    acc[shopItemBase.id] = {
                      ...acc[shopItemBase.id],
                      // TODO POS: Update when backend ready
                      variant_ids: [1767, 1769, 1766],
                    };
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
    [retrieveShopItemBarcodeUnicityActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'barcodeUnicity', 'loading'],
        payload,
      );
    },
    [retrieveShopItemBarcodeUnicityActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'barcodeUnicity', 'error'],
        payload,
      );
    },
    [retrieveShopItemBarcodeUnicityActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { barcode: string; data: ShopItemBarcodeUnicity } },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'barcodeUnicity', payload.barcode],
        payload.data.barcode_is_unique,
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
          data: PaginatedResponse<ShopItem>;
          baseItemId: number;
        };
      },
    ) => {
      const { next_page, count, page, results } = payload.data;
      // IMPORTANT : Related to quicksale only. We don't perform a paginated call and therefore the payload doesn't include next_page, count, page, results
      if (!next_page && !count && !page && !results) {
        return state.setIn(
          [
            'shopItemReworked',
            'itemVariant',
            'byBaseItemId',
            `${payload.baseItemId}`,
            'variants',
          ],
          payload.data,
        );
      }
      return state
        .setIn(
          [
            'shopItemReworked',
            'itemVariant',
            'byBaseItemId',
            `${payload.baseItemId}`,
            'next_page',
          ],
          next_page,
        )
        .setIn(
          [
            'shopItemReworked',
            'itemVariant',
            'byBaseItemId',
            `${payload.baseItemId}`,
            'count',
          ],
          count,
        )
        .setIn(
          [
            'shopItemReworked',
            'itemVariant',
            'byBaseItemId',
            `${payload.baseItemId}`,
            'page',
          ],
          page,
        )
        .setIn(
          [
            'shopItemReworked',
            'itemVariant',
            'byBaseItemId',
            `${payload.baseItemId}`,
            'variants',
          ],
          results,
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
    [createShopItemTemplateVariantsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'itemVariant',
          'create',
          'loading',
        ],
        payload,
      );
    },
    [createShopItemTemplateVariantsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemVariant', 'create', 'error'],
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
    [updateShopItemTemplateVariantBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'itemVariant',
          'updateVariant',
          'loading',
        ],
        payload,
      );
    },
    [updateShopItemTemplateVariantBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'itemVariant',
          'updateVariant',
          'error',
        ],
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
    [fetchShopItemTemplateListActions.isLoading.toString()]: (
      state,
      {
        payload,
      }: { payload: { subshopTemplateId: number; isLoading?: boolean } },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'bySubshopTemplateId',
          `${payload.subshopTemplateId}`,
          'loading',
        ],
        payload.isLoading,
      );
    },
    [fetchShopItemTemplateListActions.error.toString()]: (
      state,
      {
        payload,
      }: { payload: { subshopTemplateId: number; error: Error | null } },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'bySubshopTemplateId',
          `${payload.subshopTemplateId}`,
          'error',
        ],
        payload.error,
      );
    },
    [fetchShopItemTemplateListActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          subshopTemplateId: number;
          data: PaginatedResponse<ShopItemTemplate>;
        };
      },
    ) => {
      return state.merge(
        {
          shopTemplates: {
            shopItemTemplate: {
              bySubshopTemplateId: {
                [payload.subshopTemplateId]: payload.data,
              },
            },
          },
        },
        { deep: true },
      );
    },
    [fetchShopItemTemplateVariantListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemVariant', 'loading'],
        payload,
      );
    },
    [fetchShopItemTemplateVariantListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemVariant', 'error'],
        payload,
      );
    },
    [fetchShopItemTemplateVariantListActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          data: PaginatedResponse<ShopItemTemplate>;
          baseItemTemplateId: number;
        };
      },
    ) => {
      const { results, page, next_page, count } = payload.data;
      return state.merge(
        {
          shopTemplates: {
            shopItemTemplate: {
              itemVariant: {
                byBaseItemTemplateId: {
                  [payload.baseItemTemplateId]: {
                    page,
                    count,
                    next_page,
                    variants: results,
                  },
                },
              },
            },
          },
        },
        { deep: true },
      );
    },
    [fetchShopItemTemplateInstanceListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemInstance', 'loading'],
        payload,
      );
    },
    [fetchShopItemTemplateInstanceListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemInstance', 'error'],
        payload,
      );
    },
    [fetchShopItemTemplateInstanceListActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          data: PaginatedResponse<ShopItem>;
          baseItemTemplateId: number;
        };
      },
    ) => {
      const { results, page, next_page, count } = payload.data;
      return state.merge(
        {
          shopTemplates: {
            shopItemTemplate: {
              itemInstance: {
                byBaseItemTemplateId: {
                  [payload.baseItemTemplateId]: {
                    page,
                    count,
                    next_page,
                    items: results,
                  },
                },
              },
            },
          },
        },
        { deep: true },
      );
    },
    [createShopItemTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'create', 'loading'],
        payload,
      );
    },
    [createShopItemTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'create', 'error'],
        payload,
      );
    },
    [retrieveShopItemTemplateDetailsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemDetails', 'loading'],
        payload,
      );
    },
    [retrieveShopItemTemplateDetailsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemDetails', 'error'],
        payload,
      );
    },
    [retrieveShopItemTemplateDetailsActions.success.toString()]: (
      state,
      { payload }: { payload: ShopItemTemplate },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'itemDetails',
          'byId',
          payload.id,
        ],
        payload,
      );
    },
    [updateShopItemTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'updateShopItemTemplate',
          'loading',
        ],
        payload,
      );
    },
    [updateShopItemTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'updateShopItemTemplate',
          'error',
        ],
        payload,
      );
    },
    [deleteShopItemTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'delete', 'loading'],
        payload,
      );
    },
    [deleteShopItemTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'delete', 'error'],
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
    [createShopItemProvisionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'loading'],
        payload,
      );
    },
    [createShopItemProvisionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'updateVariant', 'error'],
        payload,
      );
    },
    [createShopItemProvisionActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number; data: Provision } },
    ) => {
      const currentStock =
        state.shopItemReworked.itemDetails.byId[payload.id].current_stock;
      return state.merge(
        {
          shopItemReworked: {
            itemDetails: {
              byId: {
                [payload.id]: {
                  current_stock: currentStock + payload.data.qty,
                },
              },
            },
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
    [fetchSubshopTemplateListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'loading'],
        payload,
      );
    },
    [fetchSubshopTemplateListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'error'],
        payload,
      );
    },
    [fetchSubshopTemplateListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<SubshopTemplate> },
    ) => {
      const { page, count, next_page, results } = payload;
      return state
        .setIn(['shopTemplates', 'subshopTemplate', 'page'], page)
        .setIn(['shopTemplates', 'subshopTemplate', 'count'], count)
        .setIn(['shopTemplates', 'subshopTemplate', 'next_page'], next_page)
        .setIn(
          ['shopTemplates', 'subshopTemplate', 'allIds'],
          uniq(results.map((subshopTemplate) => subshopTemplate.id)),
        )
        .merge(
          {
            shopTemplates: {
              subshopTemplate: {
                byId: results.reduce<PayloadReduceType<SubshopTemplate>>(
                  (acc, subshopTemplate) => {
                    acc[subshopTemplate.id] = subshopTemplate;
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
    [createSubshopTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'create', 'loading'],
        payload,
      );
    },
    [createSubshopTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'create', 'error'],
        payload,
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
    [updateSubshopTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'subshopTemplate',
          'updateSubshopTemplate',
          'loading',
        ],
        payload,
      );
    },
    [updateSubshopTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'updateSubshopTemplate', 'error'],
        payload,
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
    [deleteSubshopTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'delete', 'loading'],
        payload,
      );
    },
    [deleteSubshopTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'subshopTemplate', 'delete', 'error'],
        payload,
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
      { payload }: { payload: PaginatedResponse<ShopSupplier> },
    ) => {
      const { page, count, results, next_page } = payload;
      return state
        .setIn(['shopItemReworked', 'suppliers'], {
          page,
          count,
          next_page,
          allIds: results.map((supplier) => supplier.id),
        })
        .merge(
          {
            shopItemReworked: {
              suppliers: {
                byId: results.reduce<PayloadReduceType<ShopSupplier>>(
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
    [fetchShopSupplierTemplateListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'loading'],
        payload,
      );
    },
    [fetchShopSupplierTemplateListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'error'],
        payload,
      );
    },
    [fetchShopSupplierTemplateListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ShopSupplierTemplate> },
    ) => {
      const { page, count, results, next_page } = payload;
      return state
        .setIn(['shopTemplates', 'supplierTemplate'], {
          page,
          count,
          next_page,
          allIds: results.map((supplierTemplate) => supplierTemplate.id),
        })
        .merge(
          {
            shopTemplates: {
              supplierTemplate: {
                byId: results.reduce<PayloadReduceType<ShopSupplierTemplate>>(
                  (acc, supplierTemplate) => {
                    acc[supplierTemplate.id] = supplierTemplate;
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
    [createShopSupplierTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'create', 'loading'],
        payload,
      );
    },
    [createShopSupplierTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'create', 'error'],
        payload,
      );
    },
    [updateShopSupplierTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'supplierTemplate',
          'updateSupplierTemplate',
          'loading',
        ],
        payload,
      );
    },
    [updateShopSupplierTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        [
          'shopTemplates',
          'supplierTemplate',
          'updateSupplierTemplate',
          'error',
        ],
        payload,
      );
    },
    [deleteShopSupplierTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'delete', 'loading'],
        payload,
      );
    },
    [deleteShopSupplierTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'supplierTemplate', 'delete', 'error'],
        payload,
      );
    },
    [fetchShopItemVariantCombinationListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopItemReworked', 'itemVariant', 'loading'],
        payload,
      );
    },
    [fetchShopItemVariantCombinationListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['shopItemReworked', 'itemVariant', 'error'], payload);
    },
    [fetchShopItemVariantCombinationListActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { id: number; data: ShopItemVariantCombination[] } },
    ) => {
      if (!payload.id) return state;
      return state.setIn(
        [
          'shopItemReworked',
          'itemVariant',
          'byBaseItemId',
          payload.id,
          'combinationList',
        ],
        payload.data,
      );
    },
    [fetchShopItemTemplateVariantCombinationListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemVariant', 'loading'],
        payload,
      );
    },
    [fetchShopItemTemplateVariantCombinationListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['shopTemplates', 'shopItemTemplate', 'itemVariant', 'error'],
        payload,
      );
    },
    [fetchShopItemTemplateVariantCombinationListActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { id: number; data: ShopItemVariantCombination[] } },
    ) => {
      if (!payload.id) return state;
      return state.setIn(
        [
          'shopTemplates',
          'shopItemTemplate',
          'itemVariant',
          'byBaseItemTemplateId',
          `${payload.id}`,
          'combinationList',
        ],
        payload.data,
      );
    },
  },
  initialState,
);
