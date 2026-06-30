export type { GlobalAlertKind } from "#src/components/financial-services/global-alert/constants";

/** info = always dismissible · warning = dismissible with urgency · blocking = non-dismissible */
export type GlobalAlertSeverity = "info" | "warning" | "blocking";

export type NonBlockingGlobalAlertSeverity = Exclude<
  GlobalAlertSeverity,
  "blocking"
>;

export type GlobalAlertEntry = {
  severity: GlobalAlertSeverity;
  /** Optional deadline by which the user must complete the action. ISO 8601 date or datetime string (e.g. `"2025-06-01"` or `"2025-06-01T14:30:00Z"`). */
  dueDate?: string;
};
