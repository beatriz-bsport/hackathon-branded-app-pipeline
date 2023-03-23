export type DeliveryFee = {
  company: number;
  disabled: boolean;
  free_threshold: string | null;
  name: string;
  fee: string;
  id?: number;
};

export type DeliveryFeeCreationOrUpdatePayload = {
  free_threshold?: string;
  name: string;
  fee: string;
  id?: number;
  disabled?: boolean;
};

export type DeliveryConfiguration = {
  company?: number;
  default_delivery_fee: number;
};

export type Order = {
  id: string;
  member: number;
  state: number;
  total_price: number;
};

export type AddressType = {
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  address_state: string;
  city: string;
  country: string;
};

export type DeliveryData = {
  first_name: string;
  last_name: string;
} & AddressType;

export type OrderWithProducts<M = number> = {
  id: string;
  member: M;
  state: number;
  total_price: number;
  product_lines: Array<Product>;
  updated_at: string;
  created_at: string;
  member_archived: boolean;
  delivery_fee?: DeliveryFee;
} & DeliveryData;

export type ProductData = {
  id?: number;
  quantity: number;
  product_type: number;
  product_id: number;
};

export type Product = {
  id: number;
  name: string;
  subline: string;
  order: number;
  quantity: number;
  product_type: number;
  product_id: number;
  unit_price: number;
};

export type OrderState = {
  deliveryFee: {
    items: Array<DeliveryFee>;
    loading: boolean;
    error?: Error | null;
    createOrUpdate: {
      loading: boolean;
      error?: Error | null;
    };
  };
  configuration: {
    data: DeliveryConfiguration;
    loading: boolean;
    error?: Error | null;
    update: {
      loading: boolean;
      error?: Error | null;
    };
  };
  order: {
    current: {
      data?: OrderWithProducts;
      loading: boolean;
      error?: Error;
    };
    items: Array<OrderWithProducts>;
    nextPage?: number;
    loading: boolean;
    error?: Error;
    createOrUpdate: {
      loading: boolean;
      error?: Error;
    };
  };
  product: {
    items: Array<Product>;
    loading: boolean;
    error?: Error;
    createOrUpdate: {
      loading: boolean;
      error?: Error;
    };
  };
};

export type OrderListActions = {
  nextPage: number | null;
  orders: Array<OrderWithProducts>;
};
