type PackItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  tax: string;
};

/**
 * Backend model: PaymentCombo
 * Backend serializer: PaymentComboSerializer
 */
export type Pack = {
  id: number;
  name: string;
  description: string;
  price: string;
  use_payment_combo_tax_on_items: boolean;
  tax: string;
  company: number;
  manager_only: boolean;
  available: boolean;
  date_created: string;
  expiration_date: string | null | undefined;
  payment_packs: Array<PackItem>;
  shop_items: Array<PackItem>;
  max_purchase_per_member: number | null | undefined;
  private_passes: Array<PackItem>;
  barcode: string;
  available_payment_method_identifiers: Array<number>;
  new_member_only: boolean;
  tax_calculation: number | { source: string; parsedValue: number };
  is_usable_by_staff: boolean;
  highlighted_as_recommended: boolean;
  tags_on_consumer_item_creation: Array<number>;
  bookkeeping_account: number | undefined | null;
};

export type PackFormData = Pick<
  Pack,
  | "name"
  | "description"
  | "manager_only"
  | "is_usable_by_staff"
  | "use_payment_combo_tax_on_items"
  | "expiration_date"
  | "max_purchase_per_member"
  | "available_payment_method_identifiers"
  | "highlighted_as_recommended"
  | "new_member_only"
  | "tags_on_consumer_item_creation"
> & {
  payment_pack_ids: number[];
  shop_item_ids: number[];
  private_pass_ids: number[];
  price: number;
  tax: number;
};

export type PackFormEditData = PackFormData & { id: number };

export type PurchasedPack = {
  id: number;
  consumer_payment_packs: number[];
  provision_updates: number[];
  private_consumer_passes: number[];
  payment_combo: number;
  tax: string;
  price: string;
  member: MemberMinimal;
  date: string;
};

type MemberMinimal = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  credit_account_balance: {
    source: string;
    parsedValue: number;
  };
  total_unpaid_amount: string;
  email: string;
  consumer: number;
  date_joined: string;
  phone: string;
  accept_email: boolean;
  tags: number[];
  archived: boolean;
  birthday: string | null;
  has_bought_pack: boolean;
  is_pos: boolean;
  user_id: number;
  photo: string;
};
