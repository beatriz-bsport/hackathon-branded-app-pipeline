import { useMutation } from "@tanstack/react-query";
import type { RefObject } from "react";

import { scheduleInvoicePaymentAPI } from "@bsport/api-financial-services";
import type { Fetch } from "@bsport/fetch";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";

import {
  type StripePaymentMethodHandle,
  requireStripePaymentMethodId,
} from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/types";
import { PAYMENT_FLOW_ERROR_KEYS } from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-errors";
import {
  type InstallmentScheduleDetailValues,
  getInstallmentSingleAnchorDate,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import { ALL_PAYMENT_METHOD_SELECTOR_ID } from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import {
  getInstallmentsTabStripeClientSecretEngine,
  resolveScheduledPaymentMethod,
} from "./installments-payment-utils";
import { resolveClientSecret } from "./use-confirm-payment-utils";

type UseScheduleInstallmentsPaymentParams = {
  fetch: Fetch;
  invoiceId: string;
  selectedPaymentMethod: PaymentMethodSelectorSelection;
  manualType: Parameters<typeof resolveScheduledPaymentMethod>[1];
  installmentScheduleValues: InstallmentScheduleDetailValues | null;
  installmentAnchorDate: SelectedDate;
  isInvoiceAlreadyPaid: boolean;
  paymentClientSecret: {
    client_secret?: string;
    payment_group?: number;
  };
  getSavePaymentMethod: () => boolean;
  cardPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  sepaPaymentRef: RefObject<StripePaymentMethodHandle | null>;
};

/**
 * Mutation that schedules invoice installments after resolving the payment method.
 *
 * Client-side guards (e.g. invoice already paid) throw {@link Error}; the modal
 * surfaces them via `submitError` in `usePaymentFlowModalState` (`onError` on
 * `mutate`). That covers the race where another user pays the invoice while the
 * modal is open.
 */
export const useScheduleInstallmentsPayment = ({
  fetch,
  invoiceId,
  selectedPaymentMethod,
  manualType,
  installmentScheduleValues,
  installmentAnchorDate,
  isInvoiceAlreadyPaid,
  paymentClientSecret,
  getSavePaymentMethod,
  cardPaymentRef,
  sepaPaymentRef,
}: UseScheduleInstallmentsPaymentParams) => {
  return useMutation({
    mutationFn: async () => {
      if (isInvoiceAlreadyPaid) {
        throw new Error(PAYMENT_FLOW_ERROR_KEYS.invoiceAlreadyPaid);
      }
      if (!installmentScheduleValues) {
        throw new Error(PAYMENT_FLOW_ERROR_KEYS.invalidInstallmentSchedule);
      }

      const anchorDateIso = getInstallmentSingleAnchorDate(
        installmentAnchorDate,
      )?.toISODate();

      if (!selectedPaymentMethod) {
        throw new Error(PAYMENT_FLOW_ERROR_KEYS.missingSelectedPaymentMethod);
      }

      let selectedMethod: ReturnType<typeof resolveScheduledPaymentMethod>;

      const needsStripeConfirmation =
        getInstallmentsTabStripeClientSecretEngine(selectedPaymentMethod) ===
        "stripe";

      if (needsStripeConfirmation) {
        const paymentGroupId = paymentClientSecret.payment_group;
        const currentClientSecret = paymentClientSecret.client_secret;
        if (!paymentGroupId || !currentClientSecret) {
          throw new Error(PAYMENT_FLOW_ERROR_KEYS.missingPaymentContext);
        }

        const clientSecret = await resolveClientSecret(
          fetch,
          paymentGroupId,
          currentClientSecret,
          getSavePaymentMethod(),
        );

        const ref =
          selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.CARD
            ? cardPaymentRef
            : sepaPaymentRef;

        const result = await ref.current?.submitPayment(clientSecret);
        if (!result) {
          throw new Error(PAYMENT_FLOW_ERROR_KEYS.paymentMethodNotReady);
        }

        if (selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.CARD) {
          if (result.paymentIntentStatus !== "succeeded") {
            throw new Error(PAYMENT_FLOW_ERROR_KEYS.cardPaymentNotCompleted);
          }
        } else if (
          result.paymentIntentStatus !== "succeeded" &&
          result.paymentIntentStatus !== "processing"
        ) {
          throw new Error(PAYMENT_FLOW_ERROR_KEYS.sepaPaymentNotConfirmed);
        }

        const paymentMethodId = requireStripePaymentMethodId(result);

        selectedMethod = resolveScheduledPaymentMethod(
          selectedPaymentMethod,
          manualType,
          { newStripePaymentMethodId: paymentMethodId },
        );
      } else {
        selectedMethod = resolveScheduledPaymentMethod(
          selectedPaymentMethod,
          manualType,
        );
      }

      await scheduleInvoicePaymentAPI(fetch, {
        invoiceId,
        interval: installmentScheduleValues.installmentInterval,
        nb_interval: installmentScheduleValues.installmentNbInterval,
        recurrence_basis: installmentScheduleValues.installmentRecurrenceBasis,
        anchor_date: anchorDateIso ?? undefined,
        ...selectedMethod,
      });
    },
  });
};
