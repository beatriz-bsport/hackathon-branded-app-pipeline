import type { PaymentIntent } from "@stripe/stripe-js";

import type { CompanyTheme } from "@bsport/api-core";

import type { StripeMethod } from "./constants";

export type StripePaymentMethodProps = {
  member: {
    id: number;
    name: string;
    email: string;
  };
  method: StripeMethod;
  amountCts: number;
  clientSecret: string | undefined;
  isClientSecretLoading: boolean;
  savePaymentMethod: boolean;
  onSavePaymentMethodChange: (value: boolean) => void;
  companyTheme?: CompanyTheme;
};

export type StripePaymentMethodSubmitResult = {
  paymentIntentStatus: PaymentIntent["status"];
  /** Present after a successful `confirmPayment` when Stripe returns a payment method id. */
  paymentMethodId: string | undefined;
};

/**
 * Returns the Stripe payment method id from a submit result, or throws if missing.
 */
export const requireStripePaymentMethodId = (
  result: StripePaymentMethodSubmitResult,
): string => {
  const paymentMethodId = result.paymentMethodId;
  if (!paymentMethodId) {
    throw new Error("Missing payment method identifier after confirmation.");
  }
  return paymentMethodId;
};

export type StripePaymentMethodHandle = {
  submitPayment: (
    clientSecretOverride?: string,
  ) => Promise<StripePaymentMethodSubmitResult>;
};
