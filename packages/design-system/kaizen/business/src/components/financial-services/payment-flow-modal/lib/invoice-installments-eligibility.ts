/**
 * Invoice type identifiers — aligned with `@bsport/common-legacy` master-data `invoice-type`.
 */
const INVOICE_TYPE_REGULAR = 0;
const INVOICE_TYPE_REVERSE = 1;

export type InvoiceInstallmentsIneligibilityReason =
  | "reverseOrCreditNote"
  | "reverted"
  | "notRegularInvoice"
  | "subscriptionPlannedInvoice"
  | "noMember"
  | "nothingToPay";

export type ResolveInvoiceInstallmentsEligibilityParams = {
  invoiceType: number;
  /**
   * Subscription / planned-invoice link on the invoice (API may send `null` when absent).
   * Legacy treats any non-null, non-zero ID as blocking installments.
   */
  plannedinvoice: number | null | undefined;
  /** When set, the invoice is a credit-note style document (legacy `is_reverse`). */
  sourceInvoice: string | null;
  reverted: boolean;
  /** Member id stored on the invoice; missing, null, or 0 means no member (legacy `!invoice.member`). */
  invoiceMemberId: number | null | undefined;
  /**
   * Effective remaining amount in cents to pay.
   * Callers may adjust this (e.g. planned payment events) to mirror legacy `amountToPayCts`.
   */
  amountToPayCts: number;
};

export type ResolveInvoiceInstallmentsEligibilityResult = {
  eligible: boolean;
  reason: InvoiceInstallmentsIneligibilityReason | null;
};

const hasSubscriptionPlannedInvoice = (
  plannedinvoice: number | null | undefined,
): boolean => plannedinvoice != null && plannedinvoice !== 0;

const hasInvoiceMember = (
  invoiceMemberId: number | null | undefined,
): boolean => invoiceMemberId != null && invoiceMemberId !== 0;

/**
 * Whether installments can be offered for this invoice, mirroring legacy invoice detail
 * (`InvoicePaymentPanel` “Bill by instalment” visibility and disabled rules).
 *
 * Does not enforce permissions — legacy did not gate instalments with `takePayment`.
 */
export function resolveInvoiceInstallmentsEligibility({
  invoiceType,
  plannedinvoice,
  sourceInvoice,
  reverted,
  invoiceMemberId,
  amountToPayCts,
}: ResolveInvoiceInstallmentsEligibilityParams): ResolveInvoiceInstallmentsEligibilityResult {
  if (Boolean(sourceInvoice) || invoiceType === INVOICE_TYPE_REVERSE) {
    return { eligible: false, reason: "reverseOrCreditNote" };
  }

  if (reverted) {
    return { eligible: false, reason: "reverted" };
  }

  if (invoiceType !== INVOICE_TYPE_REGULAR) {
    return { eligible: false, reason: "notRegularInvoice" };
  }

  if (hasSubscriptionPlannedInvoice(plannedinvoice)) {
    return { eligible: false, reason: "subscriptionPlannedInvoice" };
  }

  if (!hasInvoiceMember(invoiceMemberId)) {
    return { eligible: false, reason: "noMember" };
  }

  if (amountToPayCts <= 0) {
    return { eligible: false, reason: "nothingToPay" };
  }

  return { eligible: true, reason: null };
}
