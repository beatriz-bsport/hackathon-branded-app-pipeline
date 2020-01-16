// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const _getSubShops = (state: State) => state.shop.subShops;
const _getProvisions = (state: State) => state.shop.provisions;
export const _getAllShopItems = (state: State) => state.shop.all;

const _getMarketplaceShopItems = createSelector(
  _getAllShopItems,
  (shopItems) => shopItems.filter((si) => !!si.marketplace_enabled),
);

const _getShopItems = (state: State, marketplace_only: ?boolean) => {
  if (marketplace_only) {
    return _getMarketplaceShopItems(state);
  }
  return state.shop.all;
};

export const getShopItemsAvailable = createSelector(
  _getAllShopItems,
  (shopItems) => shopItems.filter((si) => si.subshop),
);

const getSubShops = (state: State, marketplace_only: ?boolean) => {
  const shopItems = _getShopItems(state, marketplace_only);
  const subshops = _getSubShops(state);
  return subshops.map((sub) => ({
    ...sub,
    shopItems: shopItems.filter((si) => si.subshop === sub.id),
  }));
};

const getSubShopsByCompany = (
  state: State,
  companyId: number,
  marketplace_only: ?boolean,
) =>
  getSubShops(state, marketplace_only).filter(
    (sub) => sub.company === companyId,
  );

const getShopitem = (state: State, id: number) => {
  const shopitem = _getShopItems(state).find((si) => si.id === id) || {};
  return {
    ...shopitem,
    subshop: _getSubShops(state).find((sub) => sub.id === shopitem.id),
  };
};

const getProvisionByShopitem = (state: State, id: number) =>
  _getProvisions(state).filter((p) => p.shop_item === id);

export const getFreshShopIds = createSelector(
  _getAllShopItems,
  (es) => es.map((e) => e.id),
);

export default {
  getSubShopsByCompany,
  getSubShops,
  getShopitem,
  getProvisionByShopitem,
  getShopItemsAvailable,
};
