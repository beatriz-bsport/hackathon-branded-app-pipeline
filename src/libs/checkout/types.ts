export type AddItemToBasketParams = {
  check_offer_unicity?: boolean;
};

export type Basket<C = string, PPL = number> = {
  member: number;
  id: string; // uuid
  is_finalized: boolean;
  total_price: string;
  total_price_cts: number;
  checkout_items: Array<CheckoutItem>;
  company: C;
  need_address: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  state: string;
  country: string;
  city: string;
  available_payment_methods: number[];
  total_price_prepaid_lines: string;
  total_price_prepaid_lines_cts: number;
  prepaid_lines: Array<PPL>;
  instalment_payment: null | number;
};

export type BasketAddress = {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  zipcode: string;
  state: string;
  country: string;
  city: string;
};

export type CheckoutItem = {
  quantity: number;
  id: string;
  unit_price: number;
  name: string;
  buyable_item_identifier: number;
  buyable_item_id: number | string;
  sub_items?: string[];
  editable: boolean;
  clearable: boolean;
  tax: number;
  extra_data: CheckoutItemExtraData;
};

export type CheckoutItemData = {
  buyable_item_id: number | string;
  buyable_item_identifier: number;
  quantity: number;
  extra_data: { [key: string]: string | number };
};

export type CheckoutItemExtraData = {
  offers_data?: Array<CheckoutItemOfferData>;
};

export type CheckoutItemOfferData = {
  offer_id: number;
  extra_data: { [key: string]: any };
};

export type CheckoutState = {
  basket: {
    history: {
      items: Array<Basket>;
      loading: boolean;
      error: Error | null;
    };
    byId: { [id: string]: Basket };
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

export type OnRemoveCheckoutItemData = {
  checkout_item: string;
  quantity: number;
};

export type PrepaidLine = {
  id: string;
  unit_value: string; // decimal price as string
  extra_data: any;
  name: string;
};
