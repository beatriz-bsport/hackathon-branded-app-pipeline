// @flow
//
export type Provision = {
  product_name: string,
  qty: number,
  date: string,
  id: number,
  shop_item: number,
};

export type SubShopAPI = {
  id: number,
  name: string,
  company: number,
  shopitems: Array<number>,
};

export type ShopItem = {
  id: number,
  name: string,
  subtitle: string,
  description: string,
  tva: number,
  price: number,
  cover: string,
  company: number,
  unlimited_provisions: boolean,
  subshop: number,
  marketplace_enabled: boolean,
  is_deliverable: boolean,
  onsite_payment_available: boolean,
};

export type SubShop = {
  id: number,
  name: string,
  company: number,
  shopitems: Array<ShopItem>,
};

export type ShopState = {
  subShops: Array<SubShopAPI>,
  shopItem: {
    byId: { [number]: ShopItem },
    asManager: {
      loading: boolean,
      error: ?Error,
      allIds: Array<number>,
    },
    asConsumer: {
      loading: boolean,
      error: ?Error,
      allIds: Array<number>,
    },
    bulk: {
      loading: boolean,
      error: ?Error,
    },
  },
  provision: {
    items: Array<Provision>,
    loading: boolean,
    count: number,
    page: number,
  },
};
