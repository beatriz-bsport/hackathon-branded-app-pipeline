type ProductLine = {
  quantity: number;
  product_type: number;
  product_id: number;
  name: string;
  subline: string;
  unit_price: string;
  order: string; // order ID
};

type DeliveryFee = {
  company: number;
  disabled: boolean;
  free_threshold: {
    source: string;
    parsedValue: number;
  };
  fee: {
    source: string;
    parsedValue: number;
  };
  name: string | null;
  id: number;
};

export type Order = {
  id: string;
  member: number;
  state: number;
  total_price: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  address_state: string;
  city: string;
  country: string;
  updated_at: string; // ISO date string
  created_at: string; // ISO date string
  member_archived: boolean;
  product_lines: Array<ProductLine>;
  delivery_fee: DeliveryFee;
};
