/** Query params used to open and control the payment flow modal via URL. */
export const PAYMENT_FLOW_SEARCH_PARAMS = {
  open: "pfOpen",
  invoiceId: "invoiceId",
  memberId: "memberId",
} as const;

/** Custom `window` events for payment-flow cross-bundle coordination. */
export const PAYMENT_FLOW_WINDOW_EVENTS = {
  confirmed: "paymentFlowConfirmed",
} as const;

/**
 * Custom `window` events expected by host apps (e.g. navigation-sidebar) for reactive URL.
 * Keep in sync with `WINDOW_EVENTS` in navigation-sidebar.
 */
export const HOST_WINDOW_EVENTS = {
  navigation: "navigation",
} as const;
