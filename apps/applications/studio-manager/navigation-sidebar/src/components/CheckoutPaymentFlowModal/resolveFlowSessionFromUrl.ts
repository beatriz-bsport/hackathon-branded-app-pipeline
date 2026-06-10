import {
  CHECKOUT_FLOW_SEARCH_PARAMS,
  CHECKOUT_PAYMENT_FLOW_MODE,
  type CheckoutPaymentFlowMode,
  FULL_PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_SEARCH_PARAMS,
} from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";

import {
  BASKET_START_TRIGGERS,
  DEFAULT_BASKET_START_TRIGGER,
} from "#src/events/register";

type BasketStartTrigger = (typeof BASKET_START_TRIGGERS)[number];

export type FlowSessionFromUrl = {
  mode: CheckoutPaymentFlowMode;
  memberId?: number;
  invoiceId?: string;
  basketStartTrigger: BasketStartTrigger;
};

function parseCfTrigger(value: string | null): BasketStartTrigger {
  if (value == null) return DEFAULT_BASKET_START_TRIGGER;

  return (
    BASKET_START_TRIGGERS.find((trigger) => trigger === value) ??
    DEFAULT_BASKET_START_TRIGGER
  );
}

function parseMemberId(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

/**
 * Maps URL query params to a unified flow session.
 *
 * - `cfOpen` → checkout-only
 * - `pfOpen` + `invoiceId` + `memberId` → payment-only
 * - `pfOpen` without `invoiceId` → full checkout → payment
 */
export function resolveFlowSessionFromUrl(
  params: URLSearchParams,
): FlowSessionFromUrl | null {
  const hasCfOpen = params.has(CHECKOUT_FLOW_SEARCH_PARAMS.open);
  const hasPfOpen = params.has(PAYMENT_FLOW_SEARCH_PARAMS.open);
  const checkoutTrigger = parseCfTrigger(
    params.get(CHECKOUT_FLOW_SEARCH_PARAMS.trigger),
  );
  const paymentTrigger = parseCfTrigger(
    params.get(FULL_PAYMENT_FLOW_SEARCH_PARAMS.trigger),
  );
  const memberId = parseMemberId(
    params.get(PAYMENT_FLOW_SEARCH_PARAMS.memberId),
  );
  const invoiceIdParam = params.get(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId);
  const invoiceId =
    invoiceIdParam != null && invoiceIdParam !== ""
      ? invoiceIdParam
      : undefined;

  if (hasCfOpen) {
    return {
      mode: CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT,
      memberId,
      basketStartTrigger: checkoutTrigger,
    };
  }

  if (!hasPfOpen) {
    return null;
  }

  if (invoiceId != null && memberId != null) {
    return {
      mode: CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT,
      memberId,
      invoiceId,
      basketStartTrigger: paymentTrigger,
    };
  }

  return {
    mode: CHECKOUT_PAYMENT_FLOW_MODE.FULL,
    memberId,
    basketStartTrigger: paymentTrigger,
  };
}
