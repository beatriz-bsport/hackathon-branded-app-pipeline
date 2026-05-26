import { PAYMENT_FLOW_ERROR_KEYS } from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-errors";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  type AllPaymentMethodKey,
  SAVED_PAYMENT_METHOD_TYPE,
} from "#src/components/financial-services/payment-method-selector/constants";
import {
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  type PaymentMethodSelectorSelection,
} from "#src/components/financial-services/payment-method-selector/types";

import { MANUAL_METHOD_IDENTIFIER_BY_TYPE } from "./use-confirm-payment-utils";

const PAYMENT_GROUP_METHOD_IDENTIFIER_CARD = 1;
const PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA = 2;
const PAYMENT_GROUP_METHOD_IDENTIFIER_BACS = 16;
const PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT = 14;

/** "All methods" entries disabled on the installments tab (no schedule API path). */
export const INSTALLMENTS_DISABLED_ALL_METHOD_IDS: AllPaymentMethodKey[] = [
  ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE,
  ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL,
];

const isCardOrSepaAllMethodId = (id: AllPaymentMethodKey): boolean =>
  id === ALL_PAYMENT_METHOD_SELECTOR_ID.CARD ||
  id === ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT;

/**
 * Whether the selector points at new card or SEPA under "all methods".
 */
export const isAllMethodCardOrSepaDebit = (
  selection: PaymentMethodSelectorSelection,
): boolean => {
  const isAllMethodSelection =
    selection?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL;
  if (!isAllMethodSelection) return false;

  return isCardOrSepaAllMethodId(selection.id);
};

/**
 * When the installments tab is active, only new card / SEPA need a payment
 * client secret (confirm PaymentIntent, then call schedule with the resulting
 * {@link PaymentMethod} id). Other installment-capable methods use
 * non-Stripe payloads or saved method ids directly.
 */
export const getInstallmentsTabStripeClientSecretEngine = (
  selection: PaymentMethodSelectorSelection,
): "stripe" | null => {
  if (isAllMethodCardOrSepaDebit(selection)) {
    return "stripe";
  }
  return null;
};

export const isInstallmentsSelectionSupportedForScheduling = (
  selection: PaymentMethodSelectorSelection,
): boolean => {
  if (!selection) return false;

  if (selection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED) {
    return true;
  }

  return (
    isCardOrSepaAllMethodId(selection.id) ||
    selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE ||
    selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL
  );
};

export type ResolvedScheduledPaymentMethod = {
  payment_method: number;
  payment_method_identifier: number;
  payment_method_id: string | null;
};

type ResolveScheduledPaymentMethodOptions = {
  newStripePaymentMethodId?: string;
};

/**
 * Maps the payment-method selector value to the schedule-payment API payload.
 *
 * Saved methods and new Stripe card/SEPA (after PaymentIntent confirm) send a
 * concrete `payment_method_id`. Account balance and manual methods intentionally
 * omit it (`null`).
 */
export const resolveScheduledPaymentMethod = (
  selection: PaymentMethodSelectorSelection,
  manualType: keyof typeof MANUAL_METHOD_IDENTIFIER_BY_TYPE,
  options?: ResolveScheduledPaymentMethodOptions,
): ResolvedScheduledPaymentMethod => {
  if (!selection) {
    throw new Error(PAYMENT_FLOW_ERROR_KEYS.missingSelectedPaymentMethod);
  }

  if (selection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED) {
    const paymentMethodIdentifier =
      selection.paymentMethodType === SAVED_PAYMENT_METHOD_TYPE.SEPA_DEBIT
        ? PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA
        : selection.paymentMethodType === SAVED_PAYMENT_METHOD_TYPE.BACS_DEBIT
          ? PAYMENT_GROUP_METHOD_IDENTIFIER_BACS
          : PAYMENT_GROUP_METHOD_IDENTIFIER_CARD;

    return {
      payment_method: paymentMethodIdentifier,
      payment_method_identifier: paymentMethodIdentifier,
      payment_method_id: selection.id,
    };
  }

  switch (selection.id) {
    case ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE:
      return {
        payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
        payment_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
        payment_method_id: null,
      };
    case ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL: {
      const manualMethodIdentifier =
        MANUAL_METHOD_IDENTIFIER_BY_TYPE[manualType];
      return {
        payment_method: manualMethodIdentifier,
        payment_method_identifier: manualMethodIdentifier,
        payment_method_id: null,
      };
    }
    case ALL_PAYMENT_METHOD_SELECTOR_ID.CARD: {
      const paymentMethodId = options?.newStripePaymentMethodId;
      if (!paymentMethodId) {
        throw new Error(
          PAYMENT_FLOW_ERROR_KEYS.unsupportedPaymentMethodForInstallments,
        );
      }
      return {
        payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_CARD,
        payment_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_CARD,
        payment_method_id: paymentMethodId,
      };
    }
    case ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT: {
      const paymentMethodId = options?.newStripePaymentMethodId;
      if (!paymentMethodId) {
        throw new Error(
          PAYMENT_FLOW_ERROR_KEYS.unsupportedPaymentMethodForInstallments,
        );
      }
      return {
        payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        payment_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        payment_method_id: paymentMethodId,
      };
    }
    default:
      throw new Error(
        PAYMENT_FLOW_ERROR_KEYS.unsupportedPaymentMethodForInstallments,
      );
  }
};
