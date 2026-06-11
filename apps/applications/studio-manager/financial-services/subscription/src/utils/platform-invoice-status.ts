import type { PlatformInvoiceStatus } from "@bsport/api-financial-services";

export const PAID_STATUSES: PlatformInvoiceStatus[] = ["succeeded"];

export const CANCELLED_STATUSES: PlatformInvoiceStatus[] = [
  "cancelled_with_credit_note",
  "cancelled_with_negative_invoice",
  "negative_invoice_cancelling_bad_debt_invoice",
];

export const FAILED_STATUSES: PlatformInvoiceStatus[] = ["failed"];

export const DISPUTED_STATUSES: PlatformInvoiceStatus[] = ["disputed"];

export const PENDING_STATUSES: PlatformInvoiceStatus[] = ["processing"];

export const MISSING_CHARGE_STATUSES: PlatformInvoiceStatus[] = [
  "missing_charge",
];

// Statuses that require user action (retry payment)
export const ACTIONABLE_STATUSES: PlatformInvoiceStatus[] = [
  "failed",
  "missing_charge",
];

const INVOICE_STATUS_CHIP_COLOR: Record<
  PlatformInvoiceStatus,
  "positive" | "critical" | "warning" | "default"
> = {
  succeeded: "positive",
  failed: "critical",
  disputed: "warning",
  processing: "default",
  missing_charge: "warning",
  cancelled_with_credit_note: "default",
  cancelled_with_negative_invoice: "default",
  negative_invoice_cancelling_bad_debt_invoice: "default",
};

export const getInvoiceStatusChipColor = (
  status: PlatformInvoiceStatus,
): "positive" | "critical" | "warning" | "default" =>
  INVOICE_STATUS_CHIP_COLOR[status];
