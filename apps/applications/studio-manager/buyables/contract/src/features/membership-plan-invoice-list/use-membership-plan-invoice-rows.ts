import type {
  PlannedInvoice,
  PlannedInvoiceStatus,
} from "@bsport/api-buyables/billing-plan-planned-invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import type { ChipProps } from "@bsport/kaizen-primitive-core";

import {
  type MembershipPlanTranslationKeys,
  useTranslation,
} from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

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
): MembershipPlanInvoiceRowData[] => {
  const { t, i18n } = useTranslation("membership-plan");

  return invoices.map((invoice) => ({
    id: invoice.id,
    billingDate: formatDateTime(invoice.date, DATETIME_FORMATS.MEDIUM_DATE, {
      locale: i18n.language,
    }),
    statusChip: {
      label: t(INVOICE_STATUS_TRANSLATION_KEYS[invoice.status]),
      color: getInvoiceStatusColor(invoice.status),
      size: "lg",
      type: "weak",
    },
    amount: getCurrencyDisplayWithPrice(invoice.amount_due_cts / 100),
  }));
};
