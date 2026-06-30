/**
 * Ordered list of global alert kinds, from highest to lowest priority.
 * Earlier entries win for blocking alerts and are shown first for grouped alerts.
 */
export const globalAlertKinds = [
  "unpaid-invoice",
  "disputed-invoice",
  "stripe-not-configured",
  "missing-vat-number",
  "apple-developer-program-enrollment",
  "apple-developer-pending-agreements",
] as const;

/**
 * Union of the supported global alert kinds.
 */
export type GlobalAlertKind = (typeof globalAlertKinds)[number];

/**
 * Redirect target for each alert kind.
 */
const redirectUrlByKind: Record<GlobalAlertKind, string> = {
  "apple-developer-program-enrollment": "/settings/apple-developer",
  "apple-developer-pending-agreements": "/settings/apple-developer",
  "unpaid-invoice": "/billing/invoices",
  "disputed-invoice": "/billing/disputes",
  "missing-vat-number": "/settings/billing",
  "stripe-not-configured": "/settings/stripe",
};

export const redirectUrls: Record<GlobalAlertKind, string> = Object.fromEntries(
  globalAlertKinds.map((kind) => [kind, redirectUrlByKind[kind]]),
) as Record<GlobalAlertKind, string>;
