import type { CompanyTheme } from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";

import type {
  CheckoutFlowFormData,
  CheckoutFlowStartContext,
  CheckoutFlowTrackFn,
} from "#src/components/core/checkout-flow-modal/types";

import { CHECKOUT_PAYMENT_FLOW_MODE } from "./constants";

export const CHECKOUT_PAYMENT_FLOW_PHASE = {
  CHECKOUT: "checkout",
  PAYMENT: "payment",
} as const;

export type CheckoutPaymentFlowPhase =
  (typeof CHECKOUT_PAYMENT_FLOW_PHASE)[keyof typeof CHECKOUT_PAYMENT_FLOW_PHASE];

export type CheckoutPaymentFlowMode =
  (typeof CHECKOUT_PAYMENT_FLOW_MODE)[keyof typeof CHECKOUT_PAYMENT_FLOW_MODE];

export type FullPaymentFlowBasketStartTrigger =
  CheckoutFlowStartContext["basket_start_trigger"];

type CheckoutPaymentFlowModalBaseProps = {
  isOpen: boolean;
  companyId: number;
  fetch: Fetch;
  onClose: () => void;
  onPaymentConfirm?: (remainingAmountCts: number) => void;
  onError?: (error: Error) => void;
  onTrack: CheckoutFlowTrackFn;
  startContext?: CheckoutFlowStartContext;
  basketSessionId?: string;
  companyTheme?: CompanyTheme;
};

type CheckoutModeProps = CheckoutPaymentFlowModalBaseProps & {
  mode: typeof CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT;
  /** Pre-selected member for checkout. */
  memberId?: number;
  invoiceId?: string;
  /**
   * Checkout-only: host shows toast and closes after invoice creation
   * (navbar / bill member).
   */
  onCheckoutComplete?: (
    data: CheckoutFlowFormData,
    invoiceUuid: string,
  ) => void;
  onTransitionToPayment?: never;
};

type PaymentModeProps = CheckoutPaymentFlowModalBaseProps & {
  mode: typeof CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT;
  /** Member who owns the invoice. */
  memberId: number;
  /** Existing invoice to pay. */
  invoiceId: string;
  onCheckoutComplete?: never;
  onTransitionToPayment?: never;
};

type FullModeProps = CheckoutPaymentFlowModalBaseProps & {
  mode: typeof CHECKOUT_PAYMENT_FLOW_MODE.FULL;
  /** Pre-selected member for checkout; optional until chosen in the flow. */
  memberId?: number;
  /**
   * Optional when opening checkout; set internally after checkout completes.
   * Host may also pass after `onTransitionToPayment` for URL sync.
   */
  invoiceId?: string;
  onCheckoutComplete?: never;
  /**
   * Full flow only: called when checkout succeeds so the host can sync URL/session
   * (`pfOpen`, `invoiceId`, `memberId`) without unmounting the modal.
   */
  onTransitionToPayment?: (invoiceId: string, memberId: number) => void;
};

/** Props for {@link CheckoutPaymentFlowModal}, discriminated by `mode`. */
export type CheckoutPaymentFlowModalProps =
  | CheckoutModeProps
  | PaymentModeProps
  | FullModeProps;
