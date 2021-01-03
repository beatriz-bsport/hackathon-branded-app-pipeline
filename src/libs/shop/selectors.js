// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const _getSubShops = (state: State) => state.shop.subShops;
const _getProvisions = (state: State) => state.shop.provisions;

export const _getAllShopItemsId = (state: State) =>
  state.shop.shopItem.asManager.allIds;
const _getShopItemsAsConsumerIds = (state: State) =>
  state.shop.shopItem.asConsumer.allIds;

export const _getAllShopItemData = (state: State) => state.shop.shopItem.byId;

const _getShopItemsAsConsumer = createSelector(
  [_getShopItemsAsConsumerIds, _getAllShopItemData],
  (ids, data) => ids.map((id) => data[id]),
);

export const _getAllShopItems = createSelector(
  [_getAllShopItemsId, _getAllShopItemData],
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
    }));
  },
);

const getSubShopsByCompany = (
  state: State,
  companyId: number,
  as_consumer: ?boolean,
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
  [_getAllShopItemData, _getShopItemFeaturedIds],
  (data, ids) => ids.map((id) => data[id]),
);

const getProvisionByShopitem = (state: State, id: number) =>
  _getProvisions(state).filter((p) => p.shop_item === id);

export const getFreshShopIds = createSelector(_getAllShopItems, (es) =>
  es.map((e) => e.id),
);

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getProvisionByShopitem,
  getShopItemsAvailable,
};
