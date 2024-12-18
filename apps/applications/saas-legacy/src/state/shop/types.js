// @flow

import type { Immutable } from 'seamless-immutable';
import type { Provision } from '../../libs/shop/types';

type ShopItem = $ReadOnly<{ id: number }>;
type SubShop = { id: number };

export type ShopState = Immutable<{
  loading: boolean,
  all: ShopItem[],
  subShops: SubShop[],
  provision: {
    items: Array<Provision>,
    loading: boolean,
    count: number,
    page: number,
  },
}>;
export type ShopAction =
  | { type: 'NULL' }
  | {
      type: 'SHOP_ITEM_CREATEOR_UPDATE_SUCCESS',
      shopItem: ShopItem,
    }
  | {
      type: 'SUB_SHOP_UPDATE_SUCCESS',
      subShop: SubShop,
    }
  | {
      type: 'SUB_SHOP_FETCH_SUCCESS',
      subShops: SubShop[],
    }
  | {
      type: 'SUB_SHOP_CREATE_SUCCESS',
      subShop: SubShop,
    }
  | {
      type: 'SUB_SHOP_DELETE_SUCCESS',
      id: number,
    }
  | {
      type: 'SHOP_ITEM_UPDATE_PROVISIONS_SUCCESS',
      +shopItem: ShopItem,
    }
  | {
      type: 'SHOP_FETCH_SUCCESS',
      shopItems: ShopItem[],
    }
  | {
      type: 'SHOP_FETCH_START',
    }
  | {
      type: 'SHOP_FETCH_ERROR',
    }
  | {
      type: 'SHOP_ITEM_CREATEOR_UPDATE_SUCCESS',
      shopItem: ShopItem,
    }
  | {
      type: 'SHOP_ITEM_DELETE_SUCCESS',
      id: number,
    };
