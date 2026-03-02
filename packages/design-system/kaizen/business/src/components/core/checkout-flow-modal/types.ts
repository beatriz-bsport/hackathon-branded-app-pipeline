import type { Fetch } from "@bsport/fetch";

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
  default_establishment_billing_group?: number | null;
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
 * Shared fields for one invoice item (builder default and added line).
 */
type InvoiceItemBase = {
  type: ItemType;
  quantity: number;
  priceCts: number;
  discountPercent: number;
  discountAmountCts: number;
  discountReason: string;
  taxPercent?: number;
  credits?: number | null;
  durationDays?: number | null;
  durationMonths?: number | null;
  durationYears?: number | null;
  validityDateRange?: { lower: string; upper: string } | null;
};

/**
 * Form data for one invoice item (builder default or added line).
 * Loose shape: buyableItemId/itemName optional or null before selection.
 */
export type InvoiceItemFormData = InvoiceItemBase &
  Partial<GiftcardData> & {
    buyableItemId: number | null;
    activationDate: string | null;
    billingDetail: string | null;
    itemName?: string;
    startDateMethod?: number;
  };

/**
 * One item in the checkout flow form `items` array (added-item shape).
 * Strict shape: required id/name, literal null for activation/billing.
 * Giftcard fields are optional but present when type is "giftcard".
 */
export type CheckoutFlowItem = InvoiceItemBase &
  Partial<GiftcardData> & {
    buyableItemId: number;
    activationDate: null;
    billingDetail: null;
    itemName: string;
    startDateMethod?: number;
  };

/**
 * Form data for checkout flow
 */
export type CheckoutFlowFormData = {
  member: { id: number } | null;
  items: CheckoutFlowItem[];
  promoCodes: string[];
  footnote: string | null;
  passActivationDate: Date;
  establishmentBillingGroupId: number | null;
};

/**
 * Props for CheckoutFlowModal component
 */
export type CheckoutFlowModalProps = {
  companyId: number;
  fetch: Fetch;
  isOpen: boolean;
  memberId?: number;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onSubmit?: (data: CheckoutFlowFormData, invoiceUuid: string) => void;
};

/** Delivery format for giftcard (PDF or email). */
export type GiftcardDeliveryFormat = "pdf" | "email";

/**
 * Giftcard-specific data (used in both form builder state and added items)
 */
export type GiftcardData = {
  expirationDays: number | null;
  giftcardRecipientName: string;
  giftcardFrom: string;
  giftcardTo: string;
  giftcardPersonalMessage: string;
  giftcardDeliveryFormat: GiftcardDeliveryFormat;
  // PDF-specific fields
  giftcardValidFrom: string;
  // Email-specific fields
  giftcardBackgroundImage: string | null;
  giftcardRecipientEmails: string[];
  giftcardScheduledDate: string;
  giftcardScheduledTime: string;
};
