import type { BuyableItemIdentifier } from "@bsport/api-financial-services";

export type Invoice<M = number, PI = number, II = number> = {
  amount_due_cts: number;
  amount_paid_cts: number;
  author: number;
  billing_plan: number | null;
  custom_footer: string;
  date: string;
  establishment: number | null;
  establishment_billing_group_name: string;
  exported_invoice_error_code: ExportInvoiceErrorCode | null;
  exported_invoice_error_message: string | null;
  exported_invoice_file_path: string | null;
  exported_invoice_status: ExportInvoiceStatus | null;
  fully_payed: string;
  has_pending_payment: boolean | null;
  invoice_items: Array<II>;
  invoice_legal_identifier: string | null;
  invoice_type: InvoiceType;
  is_draft: boolean;
  is_finalized: boolean;
  is_member_pos: boolean;
  is_quick_invoice: boolean | null;
  is_v2: boolean;
  member: M;
  member_archived: boolean;
  memberName: string;
  payments: Array<PI>;
  plannedinvoice: number;
  price_due: string;
  price_payed: string;
  quickbooks_status: number;
  reverse_invoices: Array<string>;
  reverse_invoices_payment_status: PaymentRefundStatus | null;
  revert_reason: string;
  reverted: boolean;
  source: number;
  source_invoice: string | null;
  status: InvoiceStatusEnum;
  staff_history: [];
  stripe_invoice_pdf: string | null;
  uuid: string;
  voucher: string;
};

enum ExportInvoiceErrorCode {
  NO_INVOICE_EXPORTER = 14210,
  NO_USER_OFFICIAL_DOCUMENT_ID = 14211,
  INVOICE_EXPORT_INCOMPLETE_USER_ADDRESS = 14212,
  INVOICE_EXPORT_SCHEMA_COMPLIANCE = 14213,
  INVOICE_EXPORT_EMPTY_ZIP = 14214,
}

enum ExportInvoiceStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export enum InvoiceStatusEnum {
  DRAFT = "draft",
  OPEN = "open",
  PAID = "paid",
  VOIDED = "voided",
  REFUNDED = "refunded",
}

enum InvoiceType {
  REGULAR = 0,
  REVERSE = 1,
  EMPTY_PAYMENT_CONTAINER = 2,
  MIGRATION = 3,
}

enum PaymentRefundStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export type FetchInvoiceByInvoiceItemParams = {
  buyableItemIdentifier: BuyableItemIdentifier;
  buyableItemId: number;
};
