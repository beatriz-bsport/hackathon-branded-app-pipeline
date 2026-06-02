/**
 * Line item sent when creating an invoice (buyable_items entry).
 * Backend only uses these fields (BuyableItemSerializer);
 * legacy sometimes sends full catalog objects (id, name, base_price, tax, ...), but those are ignored.
 * Sending this minimal set is enough.
 */
export type CreateInvoiceBuyableItem = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  price: string;
  voucher: string;
  voucher_reason?: string;
};

/**
 * Giftcard config entry for giftcard line items.
 * Backend passes this as customization_dict to GiftcardBuyableItem.
 */
export type CreateInvoiceGiftcardConfig = {
  giftcard: number;
  price?: number;
  kind?: number;
  message_is_for?: string;
  message_is_from?: string;
  message_content?: string;
  background_image?: string;
  date_to_send?: string;
  activation_datetime?: string;
  recipients?: string[];
  name?: string;
};

export type CreateInvoiceRequest = {
  member: number;
  date: string;
  is_v2: true;
  buyable_items: CreateInvoiceBuyableItem[];
  coupon_codes?: string[];
  establishment_billing_group?: number | null;
  giftcard_config_list?: CreateInvoiceGiftcardConfig[];
  custom_footer?: string;
};

type CreateInvoiceResponsePayment = {
  uuid: string;
  id: number;
  price: string;
  payment_received: boolean;
  payment_method: number;
  payment_note: string;
  invoice: string;
  stripe_charge_id: string;
  date: string;
  reverted: boolean;
};

export type CreateInvoiceResponse = {
  uuid: string;
  invoice_legal_identifier: string;
  date: string;
  member: number;
  status: string;
  voucher: string;
  invoice_type: number;
  price_due: number;
  price_payed: number;
  fully_payed: boolean;
  payments: CreateInvoiceResponsePayment[];
  invoice_items: number[];
  is_finalized: boolean;
  stripe_invoice_pdf: string | null;
  exported_invoice_file_path: string | null;
  exported_invoice_status: number | null;
  exported_invoice_error_message: string | null;
  exported_invoice_error_code: number | null;
  reverted: boolean;
  plannedinvoice: number | null;
  billing_plan: number | null;
  is_v2: boolean;
  is_draft: boolean;
  amount_due_cts: number;
  amount_paid_cts: number;
  author: number;
  source: number;
  memberName: string;
  reverse_invoices: string[];
  reverse_invoices_payment_status: string | null;
  has_pending_payment: boolean | null;
  source_invoice: string | null;
  custom_footer: string;
  establishment: number | null;
  establishment_billing_group: number | null;
  quickbooks_status: number;
  memberArchived: boolean;
  is_quick_invoice: boolean | null;
  staff_history: object[];
  is_member_pos: boolean;
  is_signed_on_fiskaly: boolean | null;
  fiskaly_sign_es_signature_status: string | null;
  revert_reason: string | null;
};

// ── Create quick invoice ──────────────────────────────────
// ── Request Body ──────────────────────────────────────────

export type InvoiceQuickCreateRequest = {
  paymentPackId: number;
  memberId: number;
  offers_data?: OfferData[];
  establishment_billing_group_id?: number | null;
  keep_credits?: boolean;
  notify_member?: boolean;
  voucher?: number;
  voucher_reason?: string | null;
};

export type OfferData = {
  offer_id: number;
  extra_data?: {
    spot_id?: number;
  };
};

// ── Response 201 ──────────────────────────────────────────

export type InvoiceQuickCreateResponse = {
  uuid: string;
  invoice_legal_identifier: string;
  invoice_type: string;
  date: string;
  member: number;
  voucher: string;
  price_due: string;
  price_payed: string;
  fully_payed: boolean;
  payments: Payment[];
  invoice_items: InvoiceItem[];
  is_finalized: boolean;
  stripe_invoice_pdf: string | null;
  reverted: boolean;
  plannedinvoice: number | null;
  billing_plan: number | null;
  is_v2: boolean;
  is_draft: boolean;
  amount_due_cts: number;
  amount_paid_cts: number;
  reverse_invoices: number[];
  source_invoice: number | null;
  custom_footer: string;
  establishment: number | null;
  establishment_billing_group: number | null;
  quickbooks_metadata: Record<string, unknown> | null;
  is_quick_invoice: boolean;
};

export type Payment = {
  uuid: string;
  id: number;
  price: string;
  payment_received: boolean;
  payment_method: string;
  payment_note: string;
  invoice: number;
  invoice_public_identifier: string;
  stripe_charge_id: string | null;
  date: string;
  reverted: boolean;
  is_method_editable: boolean;
  is_returnable: boolean;
  transaction_fee: string | null;
  payment_engine: string;
  is_v2: boolean;
  is_processing: boolean;
  returned_amount: string;
};

export type InvoiceItem = {
  id: number;
  price: string;
  incremental_consumer_giftcard_identifier: string | null;
  total_price_notax: string;
  total_price: string;
  invoice: number;
  voucher: string;
  voucher_reasons: string[];
  object_id: number | null;
  content_type: number | null;
  subtitle: string;
  name: string;
  reverted: boolean;
  consumer_giftcard_kind: string | null;
};
