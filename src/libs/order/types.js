// @flow

export type DeliveryFee = {
  free_threshold: number,
  name: string,
  fee: number,
  id: ?number,
};

export type Order = {
  id: string,
  member: number,
  state: number,
  total_price: number,
};

export type AddressType = {
  address_line_1: string,
  address_line_2: string,
  zipcode: string,
  city: string,
  country: string,
};

export type DeliveryData = {
  first_name: string,
  last_name: string,
} & AddressType;

export type OrderWithProducts = {
  id: string,
  member: number,
  state: number,
  total_price: number,
  product_lines: Array<Product>,
  updated_at: string,
  created_at: string,
  member_archived: boolean,
} & DeliveryData;

export type ProductData = {
  id?: number,
  quantity: number,
  product_type: number,
  product_id: number,
};

export type Product = {
  id: number,
  name: string,
  subline: string,
  order: number,
  quantity: number,
  product_type: number,
  product_id: number,
  unit_price: number,
};

export type OrderState = {
  order: {
    current: {
      data: ?OrderWithProducts,
      loading: boolean,
      error: ?Error,
    },
    items: Array<Order>,
    nextPage: ?number,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  product: {
    items: Array<Product>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
};
