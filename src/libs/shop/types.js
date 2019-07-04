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
};

export type SubShop = {
  id: number,
  name: string,
  company: number,
  shopitems: Array<ShopItem>,
};

export type ShopState = {
  subShops: Array<SubShopAPI>,
  all: Array<ShopItem>,
  loading: boolean,
};
