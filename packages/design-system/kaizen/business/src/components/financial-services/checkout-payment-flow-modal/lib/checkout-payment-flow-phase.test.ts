import { describe, expect, it } from "vitest";

import { INVOICE_COMPLETION_INTENT } from "#src/components/core/checkout-flow-modal/constants";
import { CHECKOUT_PAYMENT_FLOW_MODE } from "#src/components/financial-services/checkout-payment-flow-modal/constants";
import { CHECKOUT_PAYMENT_FLOW_PHASE } from "#src/components/financial-services/checkout-payment-flow-modal/types";

import {
  INVOICE_CREATED_FLOW_ACTION,
  getInitialCheckoutPaymentFlowPhase,
  resolveInvoiceCreatedFlowAction,
} from "./checkout-payment-flow-phase";

describe("getInitialCheckoutPaymentFlowPhase", () => {
  it("starts on checkout for checkout and full modes", () => {
    expect(
      getInitialCheckoutPaymentFlowPhase(CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT),
    ).toBe(CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT);
    expect(
      getInitialCheckoutPaymentFlowPhase(CHECKOUT_PAYMENT_FLOW_MODE.FULL),
    ).toBe(CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT);
  });

  it("starts on payment for payment-only mode", () => {
    expect(
      getInitialCheckoutPaymentFlowPhase(CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT),
    ).toBe(CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT);
  });
});

describe("resolveInvoiceCreatedFlowAction", () => {
  it("transitions to payment in full mode when paying now", () => {
    expect(
      resolveInvoiceCreatedFlowAction(
        CHECKOUT_PAYMENT_FLOW_MODE.FULL,
        "invoice-uuid",
        42,
        INVOICE_COMPLETION_INTENT.PAY_NOW,
      ),
    ).toEqual({
      type: INVOICE_CREATED_FLOW_ACTION.TRANSITION_TO_PAYMENT,
      invoiceId: "invoice-uuid",
      memberId: 42,
    });
  });

  it("defers payment in full mode when paying later", () => {
    expect(
      resolveInvoiceCreatedFlowAction(
        CHECKOUT_PAYMENT_FLOW_MODE.FULL,
        "invoice-uuid",
        42,
        INVOICE_COMPLETION_INTENT.PAY_LATER,
      ),
    ).toEqual({
      type: INVOICE_CREATED_FLOW_ACTION.DEFER_PAYMENT,
      invoiceId: "invoice-uuid",
      memberId: 42,
    });
  });

  it("completes checkout for checkout-only mode when paying now", () => {
    expect(
      resolveInvoiceCreatedFlowAction(
        CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT,
        "invoice-uuid",
        42,
        INVOICE_COMPLETION_INTENT.PAY_NOW,
      ),
    ).toEqual({ type: INVOICE_CREATED_FLOW_ACTION.COMPLETE_CHECKOUT });
  });

  it("defers payment for checkout-only mode when paying later", () => {
    expect(
      resolveInvoiceCreatedFlowAction(
        CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT,
        "invoice-uuid",
        42,
        INVOICE_COMPLETION_INTENT.PAY_LATER,
      ),
    ).toEqual({
      type: INVOICE_CREATED_FLOW_ACTION.DEFER_PAYMENT,
      invoiceId: "invoice-uuid",
      memberId: 42,
    });
  });

  it("completes checkout when mode is payment (unexpected path)", () => {
    expect(
      resolveInvoiceCreatedFlowAction(
        CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT,
        "invoice-uuid",
        42,
      ),
    ).toEqual({ type: INVOICE_CREATED_FLOW_ACTION.COMPLETE_CHECKOUT });
  });
});
