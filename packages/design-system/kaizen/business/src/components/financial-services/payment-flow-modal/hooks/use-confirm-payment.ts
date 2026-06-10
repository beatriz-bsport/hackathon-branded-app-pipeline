import { useMutation } from "@tanstack/react-query";
import type { RefObject } from "react";

import type { Fetch } from "@bsport/fetch";

import type { PaymentFlowGiftCard } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/types";
import type { StripePaymentMethodHandle } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/types";
import type { ConfirmPaymentFormValues } from "#src/components/financial-services/payment-flow-modal/types";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import { executeConfirmPayment } from "./use-confirm-payment-execute";

type UseConfirmPaymentParams = {
  fetch: Fetch;
  invoiceId: string;
  invoiceRemainingAmount?: number;
  isInvoiceAlreadyPaid: boolean;
  selectedPaymentMethod: PaymentMethodSelectorSelection;
  paymentClientSecret: {
    client_secret?: string;
    payment_group?: number;
    price_cts?: number;
  };
  getFormValues: () => ConfirmPaymentFormValues;
  availableGiftCards: PaymentFlowGiftCard[];
  cardPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  sepaPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  stripePublishableKey?: string;
  invoiceAlreadyPaidAlert: string;
};

/**
 * Builds the payment-confirmation mutation for the payment-flow modal.
 *
 * This hook centralizes:
 * - the "invoice already paid" guard;
 * - execution of business confirmation logic (`executeConfirmPayment`);
 */
export const useConfirmPayment = ({
  fetch,
  invoiceId,
  invoiceRemainingAmount,
  isInvoiceAlreadyPaid,
  selectedPaymentMethod,
  paymentClientSecret,
  getFormValues,
  availableGiftCards,
  cardPaymentRef,
  sepaPaymentRef,
  stripePublishableKey,
  invoiceAlreadyPaidAlert,
}: UseConfirmPaymentParams) => {
  return useMutation({
    mutationFn: () => {
      if (isInvoiceAlreadyPaid) {
        throw new Error(invoiceAlreadyPaidAlert);
      }

      return executeConfirmPayment({
        fetch,
        invoiceId,
        invoiceRemainingAmount,
        selectedPaymentMethod,
        paymentClientSecret,
        formValues: getFormValues(),
        availableGiftCards,
        cardPaymentRef,
        sepaPaymentRef,
        stripePublishableKey,
      });
    },
  });
};
