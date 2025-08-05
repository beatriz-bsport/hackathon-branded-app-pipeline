import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import uniqBy from 'lodash/uniqBy';

import type { SelectOption } from '#src/libs/types';
import type { State } from '../../state/types';
import type { RootState } from '../../reducers';
import type { ShopItem, SubShop } from './types';

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
 * Here we also want to return the shopItem not linked to any subshop
 * This selector is used in the scope of the old webshop
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

const getShopItemTemplateSupplierById = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.byId;

const getShopItemStandaloneAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemStandalone.allIds;

export const getShopItemStandaloneById = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemStandalone.byId;

const getShopItemBaseAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemBase.allIds;

export const getShopItemBaseById = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemBase.byId;

const getSubshopAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.allIds;

const getSubshopById = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.byId;

const getShopSupplierAllIds = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.allIds;

const getSupplierState = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers;

export const getShopItemBarcodeListUnicity = (
  state: RootState,
  barcodeList: string[],
) => {
  const barcodeState = state.shopReworked.shopItemReworked.barcodeUnicity;
  const barcodeUnicityArray = [...new Set(barcodeList)].reduce(
    (acc, barcode: string) => [...acc, barcodeState[barcode]],
    [],
  );
  if (barcodeUnicityArray.includes(false)) return false;
  return true;
};

export const getShopItemBarcodeUnicity = (state: RootState, barcode: string) =>
  state.shopReworked.shopItemReworked.barcodeUnicity[barcode];

export const getShopItemBarcodeUnicityLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.barcodeUnicity.loading;

const getShopSupplierById = (state: RootState) =>
  state.shopReworked.shopItemReworked.suppliers.byId;

const getShopSupplierTemplateAllIds = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.allIds;

const getShopSupplierTemplateById = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.byId;

/** Returns the loading state of the shop item details */
export const getShopItemDetailLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.loading;

/** Returns the loading state of the item variant list */
export const getShopItemVariantListLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.loading;

/** Returns the loading state of the item template variant list */
export const getShopItemTemplateVariantListLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemVariant.loading;

/** Returns the loading state when deleting a base/standalone item */
export const getShopItemDetailDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.delete.loading;

/** Retrieves the shop item object from an base/standalone item id */
export const getShopItemDetail = (state: RootState, id: number) => {
  if (!id) return null;
  return state.shopReworked.shopItemReworked.itemDetails.byId[id] ?? null;
};

/** Retrieves a shop item template object for franchisor */
export const getShopItemTemplateDetail = (state: RootState, id: number) => {
  if (!id) return null;
  return (
    state.shopReworked.shopTemplates.shopItemTemplate.itemDetails.byId[id] ??
    null
  );
};

/** Returns the loading state of the shop item template details */
export const getShopItemTemplateDetailLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemDetails.loading;

/** Returns the loading state when deleting a shop item template */
export const getShopItemTemplateDetailDeleteLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemDetails.delete.loading;

/** Returns the loading state when updating a variant item */
export const getShopItemVariantUpdateLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.updateVariant.loading;

/** Returns the loading state when deleting a variant item */
export const getShopItemVariantDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemVariant.delete.loading;

/** Returns the loading state when updating a variant item */
export const getShopItemTemplateVariantUpdateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemVariant.updateVariant
    .loading;

/** Returns the loading state when deleting a variant item */
export const getShopItemTemplateVariantDeleteLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemVariant.delete.loading;

/** Returns the loading state when fetching variant instances from a shop item template */
export const getShopItemTemplateInstanceListLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.itemInstance.loading;

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
 * Retrieves the variant state related to a base item template.\
 * If the base item is standalone, variants is always an empty array.
 * @param id The base/standalone item id to retrieve variant state for
 */
export const getShopItemTemplateVariantState = (
  state: RootState,
  shopItemTemplateId: number,
) => {
  const shopItemVariantState =
    state.shopReworked.shopTemplates.shopItemTemplate.itemVariant
      .byBaseItemTemplateId[shopItemTemplateId];
  if (!shopItemTemplateId || !shopItemVariantState) {
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
 * Retrieves the shop item instance state related to a shop item template.
 * @param id The base/standalone item id to retrieve instance state for
 */
export const getShopItemTemplateInstanceState = (
  state: RootState,
  shopItemTemplateId: number,
) => {
  const shopItemInstanceState =
    state.shopReworked.shopTemplates.shopItemTemplate.itemInstance
      .byBaseItemTemplateId[shopItemTemplateId];
  if (!shopItemTemplateId || !shopItemInstanceState) {
    return {
      page: 1,
      next_page: null,
      count: 0,
      items: [],
    };
  }
  return shopItemInstanceState;
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
 * Retrieves the supplier template associated to a shop item template.
 * @param id The shop item template id
 */
export const getShopItemTemplateSupplier = createSelector(
  [getShopItemTemplateSupplierById, (_: RootState, id: number) => id],
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

/** Get base + standalone shop item ids */
export const getShopItemBaseAndStandaloneAllIds = createSelector(
  [getShopItemStandaloneAllIds, getShopItemBaseAllIds],
  (shopItemStandaloneAllIds, shopItemBaseAllIds) => {
    return shopItemStandaloneAllIds.concat(shopItemBaseAllIds);
  },
);

/** Get base + standalone shop item data */
export const getShopItemBaseAndStandaloneById = createSelector(
  [getShopItemStandaloneById, getShopItemBaseById],
  (shopItemStandaloneById, shopItemBaseById) => {
    return Immutable({
      ...shopItemStandaloneById,
      ...shopItemBaseById,
    });
  },
);

/** Retrieves a shop item base by its id */
export const getShopItemBase = createSelector(
  [getShopItemBaseById, (_: RootState, id: number) => id],
  (shopItemBaseById, id) => {
    if (!id) return null;
    return shopItemBaseById[id];
  },
);

export const getShopItemBaseAndStandaloneList = createSelector(
  [getShopItemBaseAndStandaloneAllIds, getShopItemBaseAndStandaloneById],
  (shopItemBaseAndStandaloneAllIds, shopItemBaseAndStandaloneById) => {
    /**
     * Cast to unknown and then as array of shop item
     * to prevent having to update all related component props
     */
    const shopItemBaseAndStandaloneList: unknown =
      shopItemBaseAndStandaloneAllIds.map(
        (id) => shopItemBaseAndStandaloneById[id],
      );
    return shopItemBaseAndStandaloneList as ShopItem[];
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

/**
 * Retrieves the combined list of all standalone and base shop items for the current company.
 * Returns an array of shop item objects.
 */
export const getStandaloneAndBaseShopItemList = createSelector(
  [getShopItemStandaloneList, getShopItemBaseList],
  (shopItemStandaloneList, shopItemBaseList) => {
    return [...shopItemStandaloneList, ...shopItemBaseList];
  },
);

/**
 * Retrieves a mapping of all standalone and base shop items by their ID.
 * Returns an object where keys are shop item IDs and values are shop item objects.
 */
export const getStandaloneAndBaseShopItemById = createSelector(
  [getStandaloneAndBaseShopItemList],
  (shopItemList: ShopItem[]) =>
    shopItemList.reduce((acc, shopItem) => {
      acc[shopItem.id] = shopItem;
      return acc;
    }, {} as Record<number, ShopItem>),
);

/** Retrieves the state of subshop template for MA listing */
export const getSubshopTemplateState = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate;

const getSubshopTemplateAllIds = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.allIds;

const getSubshopTemplateById = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.byId;

/**
 * Retrieves the list of all subshop templates for MA listing
 */
export const getSubshopTemplateList = createSelector(
  [getSubshopTemplateAllIds, getSubshopTemplateById],
  (subshopTemplateAllIds, subshopTemplateById) =>
    (subshopTemplateAllIds ?? [])
      .map((subshopTemplateId) => subshopTemplateById[subshopTemplateId])
      .filter((subshopTemplate) => !!subshopTemplate),
);

/** Returns the loading state when retrieving all subshop templates */
export const getSubshopTemplateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.loading;

/** Returns the loading state when creating a subshop template */
export const getSubshopTemplateCreateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.create.loading;

/** Returns the loading state when updating a subshop template */
export const getSubshopTemplateUpdateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.updateSubshopTemplate
    .loading;

/** Returns the loading state when deleting a subshop template */
export const getSubshopTemplateDeleteLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.subshopTemplate.delete.loading;

/** Returns the loading state when retrieving all subshop */
export const getSubshopLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.subshop.loading;

/** Retrieves the state of shop item template for MA listing */
export const getShopItemTemplateState = (
  state: RootState,
  subshopTemplateId: number,
) =>
  state.shopReworked.shopTemplates.shopItemTemplate.bySubshopTemplateId[
    subshopTemplateId
  ];

/** Returns the loading state when creating a shop item template */
export const getShopItemTemplateCreateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.create.loading;

/** Returns the loading state when updating a shop item template */
export const getShopItemTemplateUpdateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.updateShopItemTemplate
    .loading;

/** Returns the loading state when deleting a shop item template */
export const getShopItemTemplateDeleteLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.shopItemTemplate.delete.loading;

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

/** Returns the loading state when retrieving all supplier templates */
export const getShopSupplierTemplateListLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.loading;

/** Returns the loading state when creating a supplier template */
export const getShopSupplierTemplateCreateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.create?.loading ?? false;

/** Returns the loading state when updating a supplier template */
export const getShopSupplierTemplateUpdateLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.updateSupplierTemplate
    ?.loading ?? false;

/** Returns the loading state when deleting a supplier template */
export const getShopSupplierTemplateDeleteLoading = (state: RootState) =>
  state.shopReworked.shopTemplates.supplierTemplate.delete?.loading ?? false;

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

/** Returns a list of all available options for variant filters on inventory tab (color/size/company) */
export const getShopItemVariantFilterOptionList = createSelector(
  [getShopItemVariantCombinationList],
  (variantCombinationList) => {
    const colorList: SelectOption[] = variantCombinationList
      .map((variant) => ({
        label: variant.color,
        value: variant.color,
      }))
      .filter((variantOption) => !!variantOption.value);
    const sizeList: SelectOption[] = variantCombinationList
      .map((variant) => ({
        label: variant.size,
        value: variant.size,
      }))
      .filter((variantOption) => !!variantOption.value);

    return {
      colors: uniqBy(colorList, 'value'),
      sizes: uniqBy(sizeList, 'value'),
    };
  },
);

/** Returns the existing variant combination list from a base item template */
export const getShopItemTemplateVariantCombinationList = (
  state: RootState,
  shopItemTemplateId: number,
) => {
  if (!shopItemTemplateId) return [];
  return (
    state.shopReworked.shopTemplates.shopItemTemplate.itemVariant
      .byBaseItemTemplateId[shopItemTemplateId]?.combinationList ?? []
  );
};

/** Franchisor: Returns a list of all available options for variant filters on inventory tab (color/size/company) */
export const getShopItemTemplateVariantFilterOptionList = createSelector(
  [getShopItemTemplateVariantCombinationList, getShopItemTemplateDetail],
  (variantCombinationList, shopItemTemplateDetail) => {
    const colorList: SelectOption[] = variantCombinationList
      .map((variant) => ({
        label: variant.color,
        value: variant.color,
      }))
      .filter((variantOption) => !!variantOption.value);

    const sizeList: SelectOption[] = variantCombinationList
      .map((variant) => ({
        label: variant.size,
        value: variant.size,
      }))
      .filter((variantOption) => !!variantOption.value);

    const companyList: SelectOption[] = (
      shopItemTemplateDetail?.synced_companies ?? []
    )
      .map((company) => ({
        label: company.name,
        value: company.id.toString(),
      }))
      .filter((variantOption) => !!variantOption.value);

    return {
      colors: uniqBy(colorList, 'value'),
      sizes: uniqBy(sizeList, 'value'),
      company: uniqBy(companyList, 'value'),
    };
  },
);

/**
 * Retrieves the list of paginated suppliers for the current company
 */
export const getShopSupplierState = createSelector(
  [getShopSupplierAllIds, getShopSupplierById, getSupplierState],
  (supplierAllIds, supplierById, shopSupplierState) => {
    return {
      page: shopSupplierState.page,
      next_page: shopSupplierState.next_page,
      count: shopSupplierState.count,
      suppliers: supplierAllIds.map((id) => supplierById[id]),
    };
  },
);

/** Retrieves the list of paginated supplier template */
export const getShopSupplierTemplateState = createSelector(
  [
    getShopSupplierTemplateAllIds,
    getShopSupplierTemplateById,
    (state: RootState) => state,
  ],
  (supplierTemplateAllIds, supplierTemplateById, state) => {
    const shopSupplierState = state.shopReworked.shopTemplates.supplierTemplate;
    return {
      page: shopSupplierState.page,
      next_page: shopSupplierState.next_page,
      count: shopSupplierState.count,
      suppliers: supplierTemplateAllIds.map((id) => supplierTemplateById[id]),
    };
  },
);

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getShopItemsAvailable,
};
