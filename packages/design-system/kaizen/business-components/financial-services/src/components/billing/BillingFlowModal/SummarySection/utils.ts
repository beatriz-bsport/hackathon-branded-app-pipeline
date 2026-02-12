import type { IconName } from "@bsport/kaizen-primitive-core";

import type { InvoiceItemFormData } from "#src/components/billing/BillingFlowModal/types";
import {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";

// Map item types to their icons (same as ItemTypeSelector)
export const itemTypeIcon: Record<InvoiceItemKind, IconName> = {
  [INVOICE_ITEMS_KINDS.pass]: "ticket-01",
  [INVOICE_ITEMS_KINDS.appointment_pass]: "ticket-01",
  [INVOICE_ITEMS_KINDS.product]: "shopping-bag-01",
  [INVOICE_ITEMS_KINDS.pack]: "package",
  [INVOICE_ITEMS_KINDS.giftcard]: "gift-02",
  [INVOICE_ITEMS_KINDS.subscription]: "refresh-cw-04",
};

export const formatDate = (dateStr: string, language?: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString(language || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const calculateTotals = (
  items: InvoiceItemFormData[],
  promoCodeDiscountCts = 0,
) => {
  const totalCts = items.reduce(
    (sum, item) => sum + item.quantity * item.priceCts,
    0,
  );

  const totalDiscountCts = Math.min(
    Math.max(promoCodeDiscountCts, 0),
    totalCts,
  );
  const totalAfterDiscountCts = Math.max(totalCts - totalDiscountCts, 0);

  const totalBeforeTaxCts = items.reduce((sum, item) => {
    const itemTotalCts = item.quantity * item.priceCts;
    const taxPercent = item.taxPercent ?? 0;
    const itemTotalBeforeTaxCts = Math.round(
      (itemTotalCts / (100 + taxPercent)) * 100,
    );
    return sum + itemTotalBeforeTaxCts;
  }, 0);

  const totalBeforeTaxAfterDiscountCts =
    totalCts > 0
      ? Math.round((totalBeforeTaxCts * totalAfterDiscountCts) / totalCts)
      : 0;

  return {
    totalCts,
    totalBeforeTaxCts: totalBeforeTaxAfterDiscountCts,
    totalAfterDiscountCts,
  };
};
