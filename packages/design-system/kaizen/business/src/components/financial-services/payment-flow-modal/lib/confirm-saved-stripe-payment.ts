import { loadStripe } from "@stripe/stripe-js";

import { SAVED_PAYMENT_METHOD_TYPE } from "#src/components/financial-services/payment-method-selector/constants";
import type { SavedPaymentMethodDiscriminator } from "#src/components/financial-services/payment-method-selector/constants";

import {
  PAYMENT_FLOW_ERROR_KEYS,
  StripePaymentError,
} from "./payment-flow-errors";

type ConfirmSavedStripePaymentParams = {
  stripePublishableKey: string;
  clientSecret: string;
  paymentMethodId: string;
  paymentMethodType?: SavedPaymentMethodDiscriminator;
};

/**
 * Confirms a PaymentIntent with a saved Stripe payment method on the client,
 * matching legacy `confirmCardPayment` / `confirmSepaDebitPayment` behavior so
 * decline codes are available in the Stripe JS error payload.
 */
export const confirmSavedStripePayment = async ({
  stripePublishableKey,
  clientSecret,
  paymentMethodId,
  paymentMethodType,
}: ConfirmSavedStripePaymentParams): Promise<void> => {
  const stripe = await loadStripe(stripePublishableKey);
  if (!stripe) {
    throw new Error(PAYMENT_FLOW_ERROR_KEYS.stripeNotConfigured);
  }

  if (!paymentMethodType) {
    throw new Error(PAYMENT_FLOW_ERROR_KEYS.paymentConfirmationFailed);
  }

  const isSepa = paymentMethodType === SAVED_PAYMENT_METHOD_TYPE.SEPA_DEBIT;

  const result = isSepa
    ? await stripe.confirmSepaDebitPayment(clientSecret, {
        payment_method: paymentMethodId,
      })
    : await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

  if (result.error) {
    throw new StripePaymentError(result.error.message ?? "", {
      stripeCode: result.error.code,
      declineCode: result.error.decline_code,
    });
  }

  const status = result.paymentIntent?.status;
  if (isSepa) {
    if (status !== "succeeded" && status !== "processing") {
      throw new Error(PAYMENT_FLOW_ERROR_KEYS.sepaPaymentNotConfirmed);
    }
    return;
  }

  if (status !== "succeeded") {
    throw new Error(PAYMENT_FLOW_ERROR_KEYS.cardPaymentNotCompleted);
  }
};
