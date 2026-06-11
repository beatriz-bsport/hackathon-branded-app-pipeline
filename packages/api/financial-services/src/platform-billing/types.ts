export type RequestUpsellPackagePayload = {
  upsellIdentifier: number;
};

export type PlatformInvoiceStatus =
  | "failed"
  | "processing"
  | "succeeded"
  | "disputed"
  | "missing_charge"
  | "cancelled_with_credit_note"
  | "cancelled_with_negative_invoice"
  | "negative_invoice_cancelling_bad_debt_invoice";

export type PlatformInvoice = {
  id: string;
  payment_backend_id: string;
  month: number;
  year: number;
  total_price_cts: number;
  pdf_url: string;
  status: PlatformInvoiceStatus;
};
