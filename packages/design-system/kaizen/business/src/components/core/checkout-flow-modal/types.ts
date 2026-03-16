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
 * Start context passed by the host to indicate how the checkout flow was opened.
 */
export type CheckoutFlowStartContext = {
  basket_start_trigger: "navbar" | "member_profile_page" | "offer_page";
  origin_url?: string;
};

export type CheckoutFlowEventName =
  | "checkout_flow_start"
  | "checkout_flow_navbar_button_clicked"
  | "checkout_flow_bill_member_profile_button_clicked"
  | "checkout_flow_bill_offer_button_clicked"
  | "checkout_flow_member_search_select_member_button_clicked"
  | "checkout_flow_member_search_member_selected"
  | "checkout_flow_member_search_member_information_button_clicked"
  | "checkout_flow_member_search_escape_key_button_clicked"
  | "checkout_flow_member_search_cross_button_clicked"
  | "checkout_flow_member_search_click_outside"
  | "checkout_flow_member_search_cancel_button_clicked"
  | "checkout_flow_member_edit_button_clicked"
  | "checkout_flow_billing_group_list_clicked"
  | "checkout_flow_billing_group_selected"
  | "checkout_flow_item_type_section_selected"
  | "checkout_flow_item_selected"
  | "checkout_flow_item_clear_button_clicked"
  | "checkout_flow_item_add_item_button_clicked"
  | "checkout_flow_item_delete_button_clicked"
  | "checkout_flow_item_unselected_cross_button_clicked"
  | "checkout_flow_item_information_button_clicked"
  | "checkout_flow_add_promo_code_button_clicked"
  | "checkout_flow_apply_promo_code_button_clicked"
  | "checkout_flow_delete_promo_code_button_clicked"
  | "checkout_flow_add_footnote_button_clicked"
  | "checkout_flow_footnote_edit_button_clicked"
  | "checkout_flow_footnote_save_button_clicked"
  | "checkout_flow_footnote_delete_button_clicked"
  | "checkout_flow_footnote_cancel_button_clicked"
  | "checkout_flow_footnote_cross_button_clicked"
  | "checkout_flow_footnote_escape_key_button_clicked"
  | "checkout_flow_subscription_button_clicked"
  | "checkout_flow_completion"
  | "checkout_flow_escape_key_button_clicked"
  | "checkout_flow_cross_button_clicked"
  | "checkout_flow_cancel_button_clicked"
  | "checkout_flow_pay_cancel";

type StartPayload = {
  basket_session_id?: string;
  basket_start_trigger?: CheckoutFlowStartContext["basket_start_trigger"];
  origin_url?: string;
  member_id?: number;
};

type MemberSearchPayload = {
  basket_session_id?: string;
  member_id?: number;
};

type BillingGroupPayload = {
  basket_session_id?: string;
  member_id?: number;
  billing_group_id_selected?: number;
};

type ItemPayload = {
  basket_session_id?: string;
  member_id?: number;
  item_type: ItemType;
  item_id: number;
  item_name: string;
  item_price: number;
  item_quantity: number;
  manual_discount_percentage?: number;
  manual_discount_amount?: number;
};

type PromoCodeApplyPayload = {
  basket_session_id?: string;
  member_id?: number;
  promo_code: string;
  promo_code_value?: number;
  promo_code_id?: number;
  promo_code_error?: string;
};

type PromoCodeDeletePayload = {
  basket_session_id?: string;
  member_id?: number;
  promo_code: string;
  promo_code_value?: number;
  promo_code_id?: number;
};

type FootnotePayload = {
  basket_session_id?: string;
  member_id?: number;
  has_footnote: boolean;
  footnote_length?: number;
};

type CompletionPayload = {
  basket_session_id?: string;
  basket_completion_trigger: "confirm";
  member_id?: number | null;
  nb_of_promo_code_applied: number;
  total_item_quantity: number;
  billing_group_id_selected: number | null;
  service_date?: string;
  invoice_creation_success: boolean;
  invoice_creation_error?: string;
  invoice_id?: string;
  total_basket_price: number;
  has_footnote: boolean;
  footnote_length?: number;
};

/** Reason the footnote modal was closed (for analytics and handlers). */
export type FootnoteCloseReason = "save" | "cancel" | "cross" | "escape";

type CancelPayload = {
  basket_session_id?: string;
  basket_cancel_trigger?: "cancel_button" | "cross_button" | "escape_key";
  member_id: number | null;
  nb_of_promo_code_applied: number;
  billing_group_id_selected: number | null;
  service_date?: string;
  invoice_creation_success?: boolean;
  invoice_id?: string;
  invoice_creation_error?: string;
  total_basket_price: number;
  total_item_quantity: number;
};

export type CheckoutFlowEventPayloadMap = {
  checkout_flow_start: StartPayload;
  checkout_flow_navbar_button_clicked: StartPayload;
  checkout_flow_bill_member_profile_button_clicked: StartPayload;
  checkout_flow_bill_offer_button_clicked: StartPayload;
  checkout_flow_member_search_select_member_button_clicked: MemberSearchPayload;
  checkout_flow_member_search_member_selected: MemberSearchPayload;
  checkout_flow_member_search_member_information_button_clicked: MemberSearchPayload;
  checkout_flow_member_search_escape_key_button_clicked: MemberSearchPayload;
  checkout_flow_member_search_cross_button_clicked: MemberSearchPayload;
  checkout_flow_member_search_click_outside: MemberSearchPayload;
  checkout_flow_member_search_cancel_button_clicked: MemberSearchPayload;
  checkout_flow_member_edit_button_clicked: {
    basket_session_id?: string;
    member_id?: number;
  };
  checkout_flow_billing_group_list_clicked: BillingGroupPayload;
  checkout_flow_billing_group_selected: BillingGroupPayload & {
    billing_group_id_selected: number;
  };
  checkout_flow_item_type_section_selected: {
    basket_session_id?: string;
    item_type: ItemType;
    member_id?: number;
  };
  checkout_flow_item_selected: ItemPayload;
  checkout_flow_item_clear_button_clicked: ItemPayload;
  checkout_flow_item_add_item_button_clicked: ItemPayload;
  checkout_flow_item_delete_button_clicked: ItemPayload;
  checkout_flow_item_unselected_cross_button_clicked: ItemPayload;
  checkout_flow_item_information_button_clicked: ItemPayload;
  checkout_flow_add_promo_code_button_clicked: MemberSearchPayload;
  checkout_flow_apply_promo_code_button_clicked: PromoCodeApplyPayload;
  checkout_flow_delete_promo_code_button_clicked: PromoCodeDeletePayload;
  checkout_flow_add_footnote_button_clicked: FootnotePayload;
  checkout_flow_footnote_edit_button_clicked: FootnotePayload;
  checkout_flow_footnote_save_button_clicked: FootnotePayload;
  checkout_flow_footnote_delete_button_clicked: FootnotePayload;
  checkout_flow_footnote_cancel_button_clicked: FootnotePayload;
  checkout_flow_footnote_cross_button_clicked: FootnotePayload;
  checkout_flow_footnote_escape_key_button_clicked: FootnotePayload;
  checkout_flow_subscription_button_clicked: MemberSearchPayload;
  checkout_flow_completion: CompletionPayload;
  checkout_flow_escape_key_button_clicked: CancelPayload;
  checkout_flow_cross_button_clicked: CancelPayload;
  checkout_flow_cancel_button_clicked: CancelPayload;
  checkout_flow_pay_cancel: CancelPayload & {
    basket_cancel_trigger: "cancel_button" | "cross_button" | "escape_key";
  };
};

/**
 * Tracking function signature: the host provides this callback to receive
 * all checkout flow tracking events.
 *
 * The payload type is narrowed by the event name, and is always required.
 */
export type CheckoutFlowTrackFn = <
  E extends CheckoutFlowEventName = CheckoutFlowEventName,
>(
  eventName: E,
  properties: CheckoutFlowEventPayloadMap[E],
) => void;

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
  onTrack: CheckoutFlowTrackFn;
  startContext?: CheckoutFlowStartContext;
  basketSessionId?: string;
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
