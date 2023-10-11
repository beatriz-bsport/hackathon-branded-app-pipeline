// @ts-nocheck
import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import type { RootState } from '../../reducers';
import { SubShop } from './types';

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
    (state, as_consumer) => as_consumer,
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

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getShopItemsAvailable,
};
