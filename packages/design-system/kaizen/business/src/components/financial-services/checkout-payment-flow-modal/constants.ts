import {
  HOST_WINDOW_EVENTS,
  PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_WINDOW_EVENTS,
} from "#src/components/financial-services/payment-flow-modal/payment-flow-integration";

/**
 * How the unified shell behaves after checkout completes.
 * - `checkout`: close via `onCheckoutComplete` (navbar / checkout-only entry points)
 * - `payment`: open directly on payment (invoice already exists)
 * - `full`: stay open and transition checkout → payment in place
 */
export const CHECKOUT_PAYMENT_FLOW_MODE = {
  CHECKOUT: "checkout",
  PAYMENT: "payment",
  FULL: "full",
} as const;

/** Query params for checkout-only entry (`openCheckoutFlow`). */
export const CHECKOUT_FLOW_SEARCH_PARAMS = {
  open: "cfOpen",
  trigger: "cfTrigger",
  memberId: "memberId",
} as const;

/**
 * Full checkout→payment flow reuses payment open params plus checkout trigger metadata.
 * Opens with `pfOpen` (no `invoiceId`) and starts on the checkout step.
 */
export const FULL_PAYMENT_FLOW_SEARCH_PARAMS = {
  ...PAYMENT_FLOW_SEARCH_PARAMS,
  trigger: CHECKOUT_FLOW_SEARCH_PARAMS.trigger,
} as const;

export {
  HOST_WINDOW_EVENTS,
  PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_WINDOW_EVENTS,
};
