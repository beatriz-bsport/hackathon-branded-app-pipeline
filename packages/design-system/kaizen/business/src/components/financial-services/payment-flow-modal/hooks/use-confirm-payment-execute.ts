import { submitInternalPaymentAPI } from "@bsport/api-financial-services/internal-payment";
import {
  applyBalanceToInvoiceAPI,
  applyGiftcardOnInvoiceAPI,
} from "@bsport/api-financial-services/invoice";
import { confirmPaymentByPaymentMethodIdAPI } from "@bsport/api-financial-services/payment-group";
import { processPaymentIntentAPI } from "@bsport/api-financial-services/terminal";

import { ALL_PAYMENT_METHOD_SELECTOR_ID } from "#src/components/financial-services/payment-method-selector/constants";
import { PAYMENT_METHOD_SELECTOR_SELECTION_KIND } from "#src/components/financial-services/payment-method-selector/types";

import type { ExecuteConfirmPaymentParams } from "../types";
import {
  MANUAL_METHOD_IDENTIFIER_BY_TYPE,
  parseIntentIdFromClientSecret,
  pollReaderActionUntilCompleted,
  resolveClientSecret,
  resolveManualDate,
} from "./use-confirm-payment-utils";

/**
 * Executes the payment flow according to the currently selected method.
 *
 * Branches by method and delegates to the relevant backend/API path:
 * - saved method confirmation;
 * - Stripe card/SEPA confirmation through element refs;
 * - terminal payment intent processing + action polling;
 * - manual payment submission;
 * - account-balance application;
 * - gift-card deduction with amount clamping.
 *
 * Throws explicit errors when mandatory context is missing so UI can surface
 * actionable feedback and stop invalid flows early.
 */
export const executeConfirmPayment = async ({
  fetch,
  invoiceId,
  invoiceRemainingAmount,
  selectedPaymentMethod,
  paymentClientSecret,
  formValues,
  availableGiftCards,
  cardPaymentRef,
  sepaPaymentRef,
}: ExecuteConfirmPaymentParams): Promise<void> => {
  const currentClientSecret = paymentClientSecret.client_secret;
  const paymentGroupId = paymentClientSecret.payment_group;
  const amountCts = paymentClientSecret.price_cts;

  if (!selectedPaymentMethod) {
    throw new Error("Missing selected payment method.");
  }

  if (
    selectedPaymentMethod.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED
  ) {
    if (!paymentGroupId) {
      throw new Error("Missing payment group for saved method.");
    }

    await confirmPaymentByPaymentMethodIdAPI(fetch, {
      payment_group_id: paymentGroupId,
      payment_method_id: selectedPaymentMethod.id,
    });
    return;
  }

  const {
    savePaymentMethod,
    terminalReaderId,
    manualType,
    manualDate,
    manualNote,
    selectedGiftCardId,
  } = formValues;

  switch (selectedPaymentMethod.id) {
    case ALL_PAYMENT_METHOD_SELECTOR_ID.CARD:
      if (!currentClientSecret || !paymentGroupId) {
        throw new Error("Missing payment context.");
      }

      {
        const clientSecret = await resolveClientSecret(
          fetch,
          paymentGroupId,
          currentClientSecret,
          savePaymentMethod,
        );
        const result =
          await cardPaymentRef.current?.submitPayment(clientSecret);

        if (result?.paymentIntentStatus !== "succeeded") {
          throw new Error("Card payment was not completed.");
        }
      }
      return;
    case ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT:
      if (!currentClientSecret || !paymentGroupId) {
        throw new Error("Missing payment context.");
      }

      {
        const clientSecret = await resolveClientSecret(
          fetch,
          paymentGroupId,
          currentClientSecret,
          savePaymentMethod,
        );
        const result =
          await sepaPaymentRef.current?.submitPayment(clientSecret);

        if (
          result?.paymentIntentStatus !== "succeeded" &&
          result?.paymentIntentStatus !== "processing"
        ) {
          throw new Error("SEPA payment could not be confirmed.");
        }
      }
      return;
    case ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL:
      if (!currentClientSecret || !paymentGroupId) {
        throw new Error("Missing payment context.");
      }

      if (!terminalReaderId) {
        throw new Error("Select a terminal first.");
      }
      {
        const clientSecret = await resolveClientSecret(
          fetch,
          paymentGroupId,
          currentClientSecret,
          savePaymentMethod,
        );
        await processPaymentIntentAPI(fetch, terminalReaderId, {
          payment_intent_id: parseIntentIdFromClientSecret(clientSecret),
          save_for_later: savePaymentMethod,
        });
        await pollReaderActionUntilCompleted(fetch, terminalReaderId);
      }
      return;
    case ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL:
      if (!currentClientSecret) {
        throw new Error("Missing payment context.");
      }

      await submitInternalPaymentAPI(fetch, {
        secret: currentClientSecret,
        payment_method_identifier: MANUAL_METHOD_IDENTIFIER_BY_TYPE[manualType],
        payment_note: manualNote,
        date: resolveManualDate(manualDate),
        price_cts: amountCts,
      });
      return;
    case ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE:
      await applyBalanceToInvoiceAPI(fetch, invoiceId);
      return;
    case ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE: {
      if (!selectedGiftCardId) {
        throw new Error("Select a gift card first.");
      }
      const selectedGiftCard = availableGiftCards.find(
        (giftCard) => giftCard.id === selectedGiftCardId,
      );
      const invoiceDue = Number.isFinite(invoiceRemainingAmount)
        ? Math.max(invoiceRemainingAmount ?? 0, 0)
        : 0;
      const amount = Math.min(
        invoiceDue,
        Number(selectedGiftCard?.availableAmount ?? 0),
      );
      if (!selectedGiftCard || amount <= 0) {
        throw new Error("Gift card has no available amount.");
      }
      await applyGiftcardOnInvoiceAPI(fetch, {
        invoiceId,
        consumer_giftcard_id: selectedGiftCardId,
        amount,
      });
      return;
    }
    default:
      return;
  }
};
