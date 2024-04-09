import { createSelector } from 'reselect';

import type { State } from '../../state/types';
import type { RootState } from '../../reducers';
import type { SubShop } from './types';

const _getSubShops = (state: State) => state.shop.subShops;

export const _getAllShopItemsId = (state: State) =>
  state.shop.shopItem.asManager.allIds;
const _getShopItemsAsConsumerIds = (state: State) =>
  state.shop.shopItem.asConsumer.allIds;

export const getAllShopItemData = (state: State) => state.shop.shopItem.byId;

const _getShopItemsAsConsumer = createSelector(
  [_getShopItemsAsConsumerIds, getAllShopItemData],
  (ids, data) => ids.map((id) => data[id]),
);

export const _getAllShopItems = createSelector(
  [_getAllShopItemsId, getAllShopItemData],
  (ids, data) => ids.map((id) => data[id]),
);

/**
 * Retrieves all shop items available for member billing etc\
 * Here we also want to return variants (not linked to any subshop)
 */
export const getShopItemsAvailable = createSelector(
  _getAllShopItems,
  (shopItems) => shopItems,
);

const getSubShops = createSelector(
  [
    _getShopItemsAsConsumer,
    _getAllShopItems,
    _getSubShops,
    (state, as_consumer: boolean) => as_consumer,
  ],
  (shopitemListAsConsumer, shopItemsList, subshopList, as_consumer) => {
    return subshopList.map((sub) => ({
      ...sub,
      shopItems: (as_consumer ? shopitemListAsConsumer : shopItemsList).filter(
        (si) => si.subshop === sub.id,
      ),
    })) as SubShop[];
  },
);

export const getSubShopsByCompany = (
  state: RootState,
  companyId: number,
  as_consumer?: boolean,
  // @ts-expect-error
) => getSubShops(state, as_consumer).filter((sub) => sub.company === companyId);

const getShopitem = (state: State, id: number) => {
  const shopitem = _getAllShopItems(state).find((si) => si.id === id) || {};
  return {
    ...shopitem,
    // @ts-expect-error
    subshop: _getSubShops(state).find((sub) => sub.id === shopitem.id),
  };
};

const _getShopItemFeaturedIds = (state: State) =>
  (state.shop.shopItem.featured || {}).allIds || [];

export const getShopItemFeaturedList = createSelector(
  [getAllShopItemData, _getShopItemFeaturedIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getFreshShopIds = createSelector(_getAllShopItems, (es) =>
  es.map((e) => e.id),
);

const _getShopItemsId = (state: State) => state.shop.shopItem.bulk.allIds;

const _getShopItemsBulk = createSelector(
  [_getShopItemsId, getAllShopItemData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getShopItemsBulk = createSelector(_getShopItemsBulk, (shopItems) =>
  shopItems.filter((si) => si.subshop),
);

/* --- REWORKED --- */

const getShopItemSupplierById = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.byId;

const getShopItemStandaloneAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemStandalone.allIds;

const getShopItemStandaloneById = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemStandalone.byId;

const getShopItemBaseAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemBase.allIds;

const getShopItemBaseById = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemBase.byId;

const getSubshopAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.allIds;

const getSubshopById = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.byId;

const getShopSupplierAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.allIds;

const getShopSupplierById = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.byId;

/** Returns the loading state of the shop item details */
export const getShopItemDetailLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.loading;

/** Returns the loading state of the item variant list */
export const getShopItemVariantListLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.loading;

/** Returns the loading state when deleting a base/standalone item */
export const getShopItemDetailDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.delete.loading;

/** Retrieves the shop item object from an base/standalone item id */
export const getShopItemDetail = (state: RootState, id: number) => {
  if (!id) return null;
  return state.shopReworked.shopItemReworked.itemDetails.byId[id] ?? null;
};

/** Returns the loading state when updating a variant item */
export const getShopItemVariantUpdateLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.updateVariant.loading;

/** Returns the loading state when deleting a variant item */
export const getShopItemVariantDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.delete.loading;

/** Retrieves the boolean for combo warning when deleting a shop item */
export const getIsShopItemUsedInCombo = (state: RootState, id: number) => {
  if (!id) return false;
  return state.shopReworked.shopItemReworked.usedInCombo.byId[id];
};

/**
 * Retrieves the variant state related to a base item.\
 * If the base item is standalone, variants is always an empty array.
 * @param id The base/standalone item id to retrieve variant state for
 */
export const getShopItemVariantState = (
  state: RootState,
  shopItemId: number,
) => {
  const shopItemVariantState =
    state.shopReworked.shopItemReworked.itemVariant.byBaseItemId[shopItemId];
  if (!shopItemId || !shopItemVariantState) {
    return {
      page: 1,
      next_page: null,
      count: 0,
      variants: [],
      combinationList: [],
    };
  }
  return shopItemVariantState;
};

/**
 * Retrieves the supplier associated to a base item.
 * @param id The base shop item id
 */
export const getShopItemSupplier = createSelector(
  [getShopItemSupplierById, (_: RootState, id: number) => id],
  (supplierById, id) => {
    if (!id) {
      return null;
    }
    return supplierById?.[id] ?? null;
  },
);

/**
 * Retrieves the list of all standalone shop items for the current company
 */
export const getShopItemStandaloneList = createSelector(
  [getShopItemStandaloneAllIds, getShopItemStandaloneById],
  (shopItemStandaloneAllIds, shopItemStandaloneById) => {
    return shopItemStandaloneAllIds.map((id) => shopItemStandaloneById[id]);
  },
);

/**
 * Retrieves the list of all base shop items for the current company
 */
export const getShopItemBaseList = createSelector(
  [getShopItemBaseAllIds, getShopItemBaseById],
  (shopItemBaseAllIds, shopItemBaseById) => {
    return shopItemBaseAllIds.map((id) => shopItemBaseById[id]);
  },
);

/**
 * Retrieves the list of all available subshops for the current company
 * This selector provides base list aka the objects as it
 */
export const getSubshopListBase = createSelector(
  [getSubshopAllIds, getSubshopById],
  (subshopAllIds, subshopById) => {
    return subshopAllIds.map((id) => subshopById[id]);
  },
);

/**
 * Retrieves the list of all subshops with their shop items
 */
export const getSubshopList = createSelector(
  [getSubshopListBase, getShopItemStandaloneList, getShopItemBaseList],
  (subShopListBase, shopItemStandaloneList, shopItemBaseList) => {
    return subShopListBase.map((subshop) => ({
      ...subshop,
      shopItems: [...shopItemStandaloneList, ...shopItemBaseList].filter(
        (shopItem) => shopItem.subshop === subshop.id,
      ),
    }));
  },
);

/** Returns the loading state when retrieving all subshop */
export const getSubshopLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.loading;

/** Returns the loading state when retrieving all subshop */
export const getShopItemStandaloneLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemStandalone.loading;

/** Returns the loading state when retrieving all subshop */
export const getShopItemBaseLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemBase.loading;

/** Returns the loading state when retrieving all suppliers */
export const getShopSupplierListLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.loading;

/** Returns the loading state when updating a supplier */
export const getShopSupplierUpdateLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.updateSupplier.loading;

/** Returns the loading state when deleting a supplier */
export const getShopSupplierDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.delete.loading;

/** Returns the existing variant combination list from a base item */
export const getShopItemVariantCombinationList = (
  state: RootState,
  id: number,
) => {
  if (!id) return [];
  return (
    state.shopReworked.shopItemReworked.itemVariant.byBaseItemId[id]
      ?.combinationList ?? []
  );
};

/**
 * Retrieves the list of all suppliers for the current company
 */
export const getShopSupplierList = createSelector(
  [getShopSupplierAllIds, getShopSupplierById],
  (subshopAllIds, subshopById) => {
    return subshopAllIds.map((id) => subshopById[id]);
  },
);

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getShopItemsAvailable,
};
