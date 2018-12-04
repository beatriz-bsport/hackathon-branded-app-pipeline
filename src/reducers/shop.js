// @flow

import Immutable from 'seamless-immutable';

import type { ShopState, ShopAction } from '../state/shop/types';
import actionTypes from '../actions/shop.types';

const initialState: ShopState = Immutable({
  loading: false,
  all: [],
  subShops: [],
});

export default function shopReducers(
  state: ShopState = initialState,
  action: ShopAction,
): ShopState {
  switch (action.type) {
    case actionTypes.SHOP_FETCH_START:
      return state.merge({
        loading: true,
        all: [],
      });
    case actionTypes.SHOP_FETCH_ERROR:
      return Immutable.merge(state, {
        loading: false,
      });
    case actionTypes.SHOP_FETCH_SUCCESS:
      return Immutable.merge(state, {
        loading: false,
        all: action.shopItems,
      });
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
      return Immutable.merge(state, {
        all: state.all.filter((item) => item.id !== id),
      });
    }
    case actionTypes.SUB_SHOP_DELETE_SUCCESS: {
      const { id } = action;
      return state.set('subShops', state.subShops.filter((ss) => ss.id !== id));
    }
    case actionTypes.SUB_SHOP_FETCH_SUCCESS: {
      return Immutable.merge(state, {
        subShops: action.subShops,
      });
    }
    case actionTypes.SUB_SHOP_CREATE_SUCCESS: {
      return Immutable.merge(state, {
        subShops: [...state.subShops, action.subShop],
      });
    }
    case actionTypes.SUB_SHOP_UPDATE_SUCCESS: {
      const { subShop } = action;
      return Immutable.merge(state, {
        subShops: [
          subShop,
          ...state.subShops.filter((ss) => ss.id !== subShop.id),
        ],
      });
    }
    case actionTypes.SHOP_ITEM_UPDATE_PROVISIONS_SUCCESS: {
      const { shopItem } = action;
      return state.set('all', [
        shopItem,
        ...state.all.filter((item) => item.id !== shopItem.id),
      ]);
    }
    default:
      return state;
  }
}
