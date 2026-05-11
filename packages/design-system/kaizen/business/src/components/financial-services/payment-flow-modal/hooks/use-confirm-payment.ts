import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RefObject } from "react";

import { memberKeys } from "@bsport/api-cdp/member";
import { invoiceKeys } from "@bsport/api-financial-services/invoice";
import { paymentGroupKeys } from "@bsport/api-financial-services/payment-group";
import { paymentMethodKeys } from "@bsport/api-financial-services/payment-method";
import type { Fetch } from "@bsport/fetch";

import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import type { PaymentFlowGiftCard } from "../payment-methods/gift-card/types";
import type { StripePaymentMethodHandle } from "../payment-methods/stripe/types";
import type { ConfirmPaymentFormValues } from "../types";
import { executeConfirmPayment } from "./use-confirm-payment-execute";

type UseConfirmPaymentParams = {
  fetch: Fetch;
  invoiceId: string;
  memberId: number;
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
  invoiceAlreadyPaidAlert: string;
};

/**
 * Builds the payment-confirmation mutation for the payment-flow modal.
 *
 * This hook centralizes:
 * - the "invoice already paid" guard;
 * - execution of business confirmation logic (`executeConfirmPayment`);
 * - cache invalidation for invoice, payment-group, member and saved methods
 *   after a successful confirmation.
 */
export const useConfirmPayment = ({
  fetch,
  invoiceId,
  memberId,
  invoiceRemainingAmount,
  isInvoiceAlreadyPaid,
  selectedPaymentMethod,
  paymentClientSecret,
  getFormValues,
  availableGiftCards,
  cardPaymentRef,
  sepaPaymentRef,
  invoiceAlreadyPaidAlert,
}: UseConfirmPaymentParams) => {
  const queryClient = useQueryClient();

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
      });
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: invoiceKeys.detail(invoiceId),
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: paymentGroupKeys.all,
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: paymentMethodKeys.saved(memberId),
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: memberKeys.detail(memberId),
          refetchType: "none",
        }),
      ]);
    },
  });
};
