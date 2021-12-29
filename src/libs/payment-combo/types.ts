export type PaymentComboItem = {
  id: number;
  price: number;
  name: string;
  quantity: number;
};

export type PaymentCombo = {
  id: number;
  name: string;
  description: string;
  price: number;
  tax: number;
  company: number;
  available: boolean;
  manager_only: boolean;
  date_created: string;
  payment_packs: Array<PaymentComboItem>;
  shop_items: Array<PaymentComboItem>;
  private_passes: Array<PaymentComboItem>;
  max_purchase_per_member: number | null;
  barcode: string;
  available_payment_method_identifier: Array<number>;
  new_member_only: boolean;
};

export type PaymentComboPayload = {
  id?: number;
  name: string;
  description: string;
  manager_only: boolean;
  price: number;
  tax: number;
  company: number;
  available: boolean;
  date_created: string;
  payment_pack_ids: Array<number>;
  shop_item_ids: Array<number>;
  private_pass_ids: Array<number>;
};

export type PaymentComboState = {
  loading: boolean;
  error?: Error;
  allIds: Array<number>;
  byId: { [id: number]: PaymentCombo };
  createOrUpdate: {
    error?: Error;
    loading: boolean;
  };
};

export type PaymentComboPurchase = {
  id: number;
  consumer_payment_packs: number[];
  date: string;
  member: {
    accept_email: boolean;
    archived: boolean;
    consumer: number;
    credit_account_balance: number;
    date_joined: string;
    email: string;
    id: number;
    name: string;
    phone: string;
    photo: string;
    tags: number[];
    vaccination_status: boolean;
  };
  payment_combo: PaymentCombo;
  price: string;
  private_consumer_passes: number[];
  provision_updates: number[];
  tax: string;
};
