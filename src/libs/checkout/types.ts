export type CheckoutItem = {
  quantity: number;
  id: string;
  unit_price: number;
  name: string;
  buyable_item_identifier: number;
  buyable_item_id: number | string;
  sub_items?: string[];
  editable: boolean;
};

export type Basket = {
  member: number;
  id: string; // uuid
  is_finalized: boolean;
  total_price: string;
  total_price_cts: string;
  checkout_items: Array<CheckoutItem>;
  company: string;
  need_address: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  country: string;
  city: string;
  available_payment_methods: number[];
};

export type CheckoutState = {
  basket: {
    current: {
      data?: Basket;
      loading: boolean;
      error?: Error;
      updating: boolean;
    };
    loading: boolean;
    error?: Error;
    generatedObjects: {
      data: Array<[key: number]>;
      loading: boolean;
      error?: Error;
    };
  };
};

export type CheckoutItemData = {
  quantity: number;
  buyable_item_identifier: number;
  buyable_item_id: number | string;
  extra_data: any;
};
