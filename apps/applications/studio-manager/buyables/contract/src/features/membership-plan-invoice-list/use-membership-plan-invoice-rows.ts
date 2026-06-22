import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import type {
  PlannedInvoice,
  PlannedInvoiceStatus,
} from "@bsport/api-buyables/billing-plan-planned-invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { isPast } from "@bsport/datetime-manipulation";
import type { ChipProps } from "@bsport/kaizen-primitive-core";

import {
  type MembershipPlanTranslationKeys,
  useTranslation,
} from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

// Statuses where the invoice can still be modified. Mirrors legacy's
// PENDING-only rule: any terminal status (paid, voided, refunded) blocks edits.
// TODO: PlannedInvoiceStatus values are mock strings. Revisit when migrating
// to the real /subscription/planned-invoice/ endpoint (numeric statuses) — the
// real mapping should collapse to PENDING only, not two statuses.
const EDITABLE_STATUSES: PlannedInvoiceStatus[] = ["draft", "open"];

const INVOICE_STATUS_TRANSLATION_KEYS = {
  draft: "invoiceList.status.draft",
  open: "invoiceList.status.open",
  paid: "invoiceList.status.paid",
  voided: "invoiceList.status.voided",
  refunded: "invoiceList.status.refunded",
} as const satisfies Record<
  PlannedInvoiceStatus,
  MembershipPlanTranslationKeys
>;

const getInvoiceStatusColor = (
  status: PlannedInvoiceStatus,
): ChipProps["color"] => {
  const statusColorMap: Record<PlannedInvoiceStatus, ChipProps["color"]> = {
    draft: "default",
    open: "default",
    paid: "positive",
    voided: "warning",
    refunded: "critical",
  };

  return statusColorMap[status];
};

export const useMembershipPlanInvoiceRows = (
  invoices: PlannedInvoice[],
  billingPlan: BillingPlan,
): MembershipPlanInvoiceRowData[] => {
  const { t, i18n } = useTranslation("membership-plan");

  // Legacy `disableDateModification`: when the plan bills on a fixed calendar
  // day, the billing date can no longer be edited manually.
  const disableDateModification = billingPlan.month_billing_day != null;

  return invoices.map((invoice) => {
    const isFirstInvoice = invoice.is_first_invoice;
    const rawAmount = invoice.amount_due_cts / 100;
    const dateOnly = invoice.date.split("T")[0];
    // NOTE: shared isPast() normalizes to start-of-day, whereas legacy compared
    // the exact timestamp (date < now). They differ only on the billing day
    // itself; accepted as a minor, intentional divergence.
    const isPastInvoice =
      isPast(invoice.date) || !EDITABLE_STATUSES.includes(invoice.status);

    return {
      id: invoice.id,
      billingDate: formatDateTime(dateOnly, DATETIME_FORMATS.MEDIUM_DATE, {
        locale: i18n.language,
      }),
      rawDate: invoice.date,
      isPast: isPastInvoice,
      isDateEditDisabled: isPastInvoice || disableDateModification,
      isFirstInvoice,
      statusChip: {
        label: t(INVOICE_STATUS_TRANSLATION_KEYS[invoice.status]),
        color: getInvoiceStatusColor(invoice.status),
        size: "lg",
        type: "weak",
      },
      amount: getCurrencyDisplayWithPrice(rawAmount),
      rawAmount,
    };
  });
};
