export type CheckoutItem = {
  quantity: number;
  id: string;
  unit_price: number;
  name: string;
  buyable_item_identifier: number;
  buyable_item_id: number | string;
  sub_items?: string[];
  editable: boolean;
  tax: number;
};

export type Basket<C = string, PPL = number> = {
  member: number;
  id: string; // uuid
  is_finalized: boolean;
  total_price: string;
  total_price_cts: string;
  checkout_items: Array<CheckoutItem>;
  company: C;
  need_address: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  country: string;
  city: string;
  available_payment_methods: number[];
  total_price_prepaid_lines: number;
  prepaid_lines: Array<PPL>;
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

export type CheckoutItemData = {
  quantity: number;
  buyable_item_identifier: number;
  buyable_item_id: number | string;
  extra_data: any;
};

export type PrepaidLine = {
  id: string;
  unit_value: string; // decimal price as string
  extra_data: any;
  name: string;
};
