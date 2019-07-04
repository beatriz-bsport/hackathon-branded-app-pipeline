// @flow

import Immutable from 'seamless-immutable';

import type { ShopState, ShopAction } from '../../state/shop/types';
import actionTypes from './action.types';

const initialState: ShopState = Immutable({
  loading: false,
  all: [],
  subShops: [],
  provision: {
    items: [],
    loading: false,
    count: 0,
    page: 1,
  },
});

export default function shopReducers(
  state: ShopState = initialState,
  action: ShopAction,
): ShopState {
  switch (action.type) {
    case actionTypes.SHOP_ITEM_FETCH_START:
      return state.merge({
        loading: true,
      });
    case actionTypes.SHOP_ITEM_FETCH_ERROR:
      return state.set('loading', false);
    case actionTypes.SHOP_ITEM_FETCH_SUCCESS: {
      let idx = state.all.findIndex((si) => si.id === action.shopitem.id);
      if (idx === -1) {
        idx = state.all.length;
      }
      return state.setIn(['all', idx], action.shopitem).set('loading', false);
    }

    case actionTypes.PROVISION_FETCH_START:
      return state
        .setIn(['provision', 'loading'], true)
        .setIn(['provision', 'items'], [])
        .setIn(['provision', 'page'], action.page);
    case actionTypes.PROVISION_FETCH_ERROR:
      return state.set('loading', false);
    case actionTypes.PROVISION_FETCH_SUCCESS: {
      return state
        .setIn(['provision', 'loading'], false)
        .setIn(['provision', 'items'], action.data.results)
        .setIn(['provision', 'count'], action.data.count);
    }

    case actionTypes.PROVISION_CREATEORUPDATE_SUCCESS: {
      const { items } = state.provision;
      const idx = state.provision.items.findIndex(
        (p) => p.id === action.data.id,
      );
      if (idx === -1 && state.provision.page === 1) {
        return state
          .setIn(['provision', 'loading'], false)
          .setIn(['provision', 'items'], [action.data, ...items]);
      }
      if (idx > 0) {
        return state
          .setIn(['provision', 'loading'], false)
          .setIn(['provision', 'items', idx], action.data);
      }
      return state.setIn(['provision', 'loading'], false);
    }

    case actionTypes.SHOP_FETCH_START:
      return state.merge({
        loading: true,
        all: [],
      });
    case actionTypes.SHOP_FETCH_ERROR:
      return state.set('loading', false);
    case actionTypes.SHOP_FETCH_SUCCESS:
      return state.set('loading', false).set('all', action.shopItems);

    case actionTypes.SHOP_ITEM_CREATEOR_UPDATE_SUCCESS: {
      const { shopItem } = action;
      if (state.all.find((si) => si.id === shopItem.id)) {
        const index = state.all.findIndex((s) => s.id === shopItem.id);
        return state.setIn(['all', index], shopItem);
      }
      return state.set('all', [...state.all, shopItem]);
    }
    case actionTypes.SHOP_ITEM_DELETE_SUCCESS: {
      const { id } = action;
      return state.set('all', state.all.filter((item) => item.id !== id));
    }
    case actionTypes.SUB_SHOP_DELETE_SUCCESS: {
      const { id } = action;
      return state.set('subShops', state.subShops.filter((ss) => ss.id !== id));
    }
    case actionTypes.SUB_SHOP_FETCH_SUCCESS: {
      return state.set('subShops', action.subShops);
    }
    case actionTypes.SUB_SHOP_CREATE_SUCCESS: {
      return state.set('subShops', [...state.subShops, action.subShop]);
    }
    case actionTypes.SUB_SHOP_UPDATE_SUCCESS: {
      const { subShop } = action;
      return state.set('subShops', [
        subShop,
        ...state.subShops.filter((ss) => ss.id !== subShop.id),
      ]);
    }
    default:
      return state;
  }
}
