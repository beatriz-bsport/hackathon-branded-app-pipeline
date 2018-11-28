// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/shop.types';

const initialState = Immutable({
  loading: false,
  all: [],
  subShops: [],
});

export default function shopReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SHOP_FETCH_START:
      return Immutable.merge(state, {
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
      if (state.all.find((si) => si.id === action.shopItem.id)) {
        return {
          ...state,
          all: state.all.map((item) => {
            if (item.id === action.shopItem.id) {
              return action.shopItem;
            }

            return item;
          }),
        };
      }
      return Immutable.merge(state, {
        all: [...state.all, action.shopItem],
      });
    }
    case actionTypes.SHOP_ITEM_DELETE_SUCCESS: {
      return Immutable.merge(state, {
        all: state.all.filter((item) => item.id !== action.id),
      });
    }
    case actionTypes.SUB_SHOP_DELETE_SUCCESS: {
      return Immutable.merge(state, {
        subShops: state.subShops.filter((ss) => ss.id !== action.id),
      });
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
      return Immutable.merge(state, {
        subShops: [
          action.subShop,
          ...state.subShops.filter((ss) => ss.id !== action.subShop.id),
        ],
      });
    }
    case actionTypes.SHOP_ITEM_UPDATE_PROVISIONS_SUCCESS: {
      return Immutable.merge(state, {
        all: [
          action.shopItem,
          ...state.all.filter((item) => item.id !== action.shopItem.id),
        ],
      });
    }
    default:
  }
  return state;
}
