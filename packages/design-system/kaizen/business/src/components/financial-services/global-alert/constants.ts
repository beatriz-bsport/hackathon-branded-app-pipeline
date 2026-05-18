import type { GlobalAlertKind } from "#src/components/financial-services/global-alert/types";

export const redirectUrls: Record<GlobalAlertKind, string> = {
  "apple-developer-program-enrollment": "/settings/apple-developer",
  "unpaid-invoice": "/billing/invoices",
  "disputed-invoice": "/billing/disputes",
  "missing-vat-number": "/settings/billing",
  "stripe-not-configured": "/settings/stripe",
};
