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

export const getShopItemsAvailable = createSelector(
  _getAllShopItems,
  (shopItems) => shopItems.filter((si) => si.subshop),
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

/** Returns the loading state of the shop item details */
export const getShopItemDetailLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.loading;

/** Returns the loading state when deleting a base/standalone item */
export const getShopItemDetailDeleteLoading = (state: RootState) =>
  state.shopReworked.shopItemReworked.itemDetails.delete.loading;

/** Retrieves the shop item object from an base/standalone item id */
export const getShopItemDetail = (state: RootState, id: number) => {
  if (!id) return null;
  return state.shopReworked.shopItemReworked.itemDetails.byId[id]?.item ?? null;
};

/** Retrieves the boolean for combo warning when deleting a shop item */
export const getIsShopItemUsedInCombo = (state: RootState, id: number) => {
  if (!id) return null;
  return (
    state.shopReworked.shopItemReworked.itemDetails.byId[id]?.isUsedInCombo ??
    false
  );
};

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getShopItemsAvailable,
};
