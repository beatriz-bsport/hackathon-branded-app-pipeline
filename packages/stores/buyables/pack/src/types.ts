type PackItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  tax: string;
};

// Backend model : PaymentCombo
// Backend serializer : PaymentComboSerializer
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

export type PackFormData = {
  id?: number;
  name: string;
  description: string;
  manager_only: boolean;
  price: number;
  tax: number;
  company: number;
  available: boolean;
  payment_pack_ids: number[];
  shop_item_ids: number[];
  private_pass_ids: number[];
  is_usable_by_staff: boolean;
};
