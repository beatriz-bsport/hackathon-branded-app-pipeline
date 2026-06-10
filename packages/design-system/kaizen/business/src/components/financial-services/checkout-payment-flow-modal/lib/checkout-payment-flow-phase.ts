import { CHECKOUT_PAYMENT_FLOW_MODE } from "#src/components/financial-services/checkout-payment-flow-modal/constants";
import {
  CHECKOUT_PAYMENT_FLOW_PHASE,
  type CheckoutPaymentFlowMode,
  type CheckoutPaymentFlowPhase,
} from "#src/components/financial-services/checkout-payment-flow-modal/types";

export function getInitialCheckoutPaymentFlowPhase(
  mode: CheckoutPaymentFlowMode,
): CheckoutPaymentFlowPhase {
  return mode === CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT
    ? CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT
    : CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT;
}

export const INVOICE_CREATED_FLOW_ACTION = {
  COMPLETE_CHECKOUT: "complete-checkout",
  TRANSITION_TO_PAYMENT: "transition-to-payment",
} as const;

export type InvoiceCreatedFlowAction =
  | { type: typeof INVOICE_CREATED_FLOW_ACTION.COMPLETE_CHECKOUT }
  | {
      type: typeof INVOICE_CREATED_FLOW_ACTION.TRANSITION_TO_PAYMENT;
      invoiceId: string;
      memberId: number;
    };

export function resolveInvoiceCreatedFlowAction(
  mode: CheckoutPaymentFlowMode,
  invoiceId: string,
  memberId: number,
): InvoiceCreatedFlowAction {
  if (mode === CHECKOUT_PAYMENT_FLOW_MODE.FULL) {
    return {
      type: INVOICE_CREATED_FLOW_ACTION.TRANSITION_TO_PAYMENT,
      invoiceId,
      memberId,
    };
  }

  return { type: INVOICE_CREATED_FLOW_ACTION.COMPLETE_CHECKOUT };
}
