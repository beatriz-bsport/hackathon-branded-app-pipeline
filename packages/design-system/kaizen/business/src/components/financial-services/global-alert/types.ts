import type { DateTime } from "@bsport/datetime-manipulation";

/**
 * Kinds of global alerts, in display priority order.
 * - First blocking kind wins; lower entries are less urgent
 * - When several non-blocking alerts are active, they will be displayed based on this priority order.
 */
export const globalAlertKinds = [
  "unpaid-invoice",
  "disputed-invoice",
  "stripe-not-configured",
  "missing-vat-number",
  "apple-developer-program-enrollment",
] as const;

export type GlobalAlertKind = (typeof globalAlertKinds)[number];

/** info = always dismissible · warning = dismissible with urgency · blocking = non-dismissible */
export type GlobalAlertSeverity = "info" | "warning" | "blocking";

export type NonBlockingGlobalAlertSeverity = Exclude<
  GlobalAlertSeverity,
  "blocking"
>;

export type GlobalAlertEntry = {
  severity: GlobalAlertSeverity;
  /** Optional deadline by which the user must complete the action. */
  dueDate?: DateTime;
};
