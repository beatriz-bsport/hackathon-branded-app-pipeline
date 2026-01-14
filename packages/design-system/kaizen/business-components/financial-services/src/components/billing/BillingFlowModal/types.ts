/**
 * Buyable Item Type identifiers
 * These match the backend buyable_item_identifier values
 */
export enum BuyableItemIdentifier {
  PaymentPack = 0,
  AppointmentPass = 1,
  ShopItem = 2,
  PaymentCombo = 3,
  Giftcard = 4,
  Subscription = 5,
}

/**
 * Item type for form selection
 */
export type ItemType =
  | "pass"
  | "appointment_pass"
  | "product"
  | "pack"
  | "giftcard"
  | "subscription";

/**
 * Base buyable item structure (from API)
 */
export type BuyableItem = {
  id: number;
  name: string;
  price_cts: number;
  currency: string;
  company: number;
};

/**
 * Payment Pack (Pass) - from API
 */
export type PaymentPack = BuyableItem & {
  number_of_classes?: number | null;
  validity_days?: number | null;
};

/**
 * Appointment Pass
 * Frontend type for appointment passes (previously called PrivatePass in backend)
 */
export type AppointmentPass = BuyableItem & {
  duration_minutes?: number;
};

/**
 * Shop Item (Product) - from API
 */
export type ShopItem = BuyableItem & {
  subshop: number;
  sku?: string | null;
  stock?: number | null;
};

/**
 * Payment Combo (Pack) - from API
 */
export type PaymentCombo = BuyableItem & {
  payment_pack_ids: number[];
  appointment_pass_ids: number[];
  shop_item_ids: number[];
};

/**
 * Gift Card - from API
 */
export type Giftcard = BuyableItem & {
  is_custom_amount: boolean;
  min_amount_cts?: number | null;
  max_amount_cts?: number | null;
};

/**
 * Billing Plan (Subscription) - from API
 */
export type BillingPlan = BuyableItem & {
  recurrence: "daily" | "weekly" | "monthly" | "yearly";
  contract_template?: number | null;
};

/**
 * Member data (from API)
 */
export type Member = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  membership_id: string | null;
  phone: string | null;
  company: number;
};

/**
 * Invoice Item (from API)
 */
export type InvoiceItem = {
  id: number;
  buyable_item_identifier: BuyableItemIdentifier;
  buyable_item_id: number;
  quantity: number;
  price_cts: number;
  discount_percent: number;
  discount_amount_cts: number;
  total_cts: number;
  activation_date: string | null;
  billing_detail: string | null;
};

/**
 * Invoice (from API)
 * Note: metadata field can contain various keys defined in InvoiceMetadataIdentifierType
 * (e.g., invoiceitem_pk, payment_identifier, product_category, etc.)
 */
export type Invoice = {
  uuid: string;
  member: number; // member ID
  company: number;
  date: string; // ISO date string
  amount_due_cts: number;
  amount_paid_cts: number;
  invoice_items: InvoiceItem[];
  payments: unknown[]; // Payment[] - to be typed later
  coupon_codes: string[];
  is_draft: boolean;
  is_finalized: boolean;
  invoice_legal_identifier: string | null;
  metadata: Record<string, unknown>;
  footnote: string | null;
};

/**
 * Coupon - from API
 */
export type Coupon = {
  id: number;
  code: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
};

/**
 * Form data for invoice item
 */
export type InvoiceItemFormData = {
  type: ItemType;
  buyableItemId: number | null;
  quantity: number;
  priceCts: number;
  discountPercent: number;
  discountAmountCts: number;
  activationDate: string | null;
  billingDetail: string | null;
};

/**
 * Form data for billing flow
 */
export type BillingFlowFormData = {
  memberId: number | undefined;
  items: InvoiceItemFormData[];
  couponCodes: string[];
  footnote: string | null;
  date: string; // Invoice date
};

/**
 * Props for BillingFlowModal component
 */
export type BillingFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memberId?: number;
};
