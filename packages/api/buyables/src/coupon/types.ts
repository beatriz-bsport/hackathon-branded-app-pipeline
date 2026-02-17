export type PromoCode = {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
  usage_count: number;
  applicable_services: string[];
};

export type AppliedCoupon = {
  voucher: number;
  coupon_partially_applied: boolean;
  id: number;
  code: string;
};

export type InvoiceItem = {
  id: number;
  price: string;
  invoice?: string;
  object_id?: number;
  content_type?: number;
  subtitle?: string;
  name: string;
  reverted?: boolean;
  total_price_notax?: string;
  total_price?: string;
  voucher?: string;
  buyable_item_id?: number;
  buyable_item_identifier?: number;
  voucher_reason?: string;
  editable?: boolean;
  company?: number;
  tax?: string;
  incremental_consumer_giftcard_identifier?: string;
  consumer_giftcard_kind?: string;
  color?: string;
  size?: string;
};

export type ApplyToInvoicePayload = {
  codes: string[];
  member: number;
  already_applied_coupons: Array<{ coupon_id: number; code: string }>;
  invoice: {
    invoice_items: InvoiceItem[];
  };
};

export type ApplyToInvoiceResponse = {
  can_be_applied: boolean;
  applied_coupons: AppliedCoupon[];
};
