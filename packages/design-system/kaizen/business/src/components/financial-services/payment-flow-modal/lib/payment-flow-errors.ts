import { STRIPE_ELEMENT_VALIDATION_ERROR } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/constants";
import { ALL_PAYMENT_METHOD_SELECTOR_ID } from "#src/components/financial-services/payment-method-selector/constants";
import {
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  type PaymentMethodSelectorSelection,
} from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, i18nNamespacePrefix } from "#src/i18n";

type StripeMessageGroup = "decline_code" | "error_code" | "errors";

const STRIPE_PAYMENT_ERROR_PARTS_SEPARATOR = ": ";
const STRIPE_I18N_ROOT = "paymentFlowModal.stripe";

/** Legacy placeholder Stripe code - maps to blank i18n and must not be shown. */
const STRIPE_LOOKUP_SKIP_CODE = "none";

/**
 * Stable i18n keys thrown from payment-flow mutations and mapped to
 * translated copy in {@link resolveSubmitErrorMessage}.
 */
export const PAYMENT_FLOW_ERROR_KEYS = {
  invoiceAlreadyPaid: "paymentFlowModal.errors.invoiceAlreadyPaid",
  invalidInstallmentSchedule:
    "paymentFlowModal.errors.invalidInstallmentSchedule",
  missingSelectedPaymentMethod:
    "paymentFlowModal.errors.missingSelectedPaymentMethod",
  missingPaymentContext: "paymentFlowModal.errors.missingPaymentContext",
  paymentMethodNotReady: "paymentFlowModal.errors.paymentMethodNotReady",
  cardPaymentNotCompleted: "paymentFlowModal.errors.cardPaymentNotCompleted",
  sepaPaymentNotConfirmed: "paymentFlowModal.errors.sepaPaymentNotConfirmed",
  unsupportedPaymentMethodForInstallments:
    "paymentFlowModal.errors.unsupportedPaymentMethodForInstallments",
  stripeNotConfigured: "paymentFlowModal.errors.stripeNotConfigured",
  paymentConfirmationFailed:
    "paymentFlowModal.errors.paymentConfirmationFailed",
  missingGiftCard: "paymentFlowModal.giftCards.selectionWarning",
} as const;

export type PaymentFlowErrorKey =
  (typeof PAYMENT_FLOW_ERROR_KEYS)[keyof typeof PAYMENT_FLOW_ERROR_KEYS];

const PAYMENT_FLOW_SUBMIT_ERROR_KEYS = new Set<string>(
  Object.values(PAYMENT_FLOW_ERROR_KEYS),
);

const FINANCIAL_SERVICES_NS = `${i18nNamespacePrefix}_financial-services`;
const SUBMIT_ERROR_FALLBACK = "paymentFlowModal.errors.generic";
const GIFT_CARD_PAYMENT_ERROR_CODE = 45001;
const PAYMENT_BLOCKED_BY_FRAUD_PROTECTION_ERROR_CODE = 12130;

const paymentFlowT = (key: string) =>
  i18nInstance.t(key, { ns: FINANCIAL_SERVICES_NS });

/**
 * Stripe client-side failures from `confirmPayment` carry `code` and `decline_code`
 * that must be preserved for translated error messages.
 *
 * TODO: Consider moving to shared financial-services utils so other FS surfaces
 * can reuse Stripe code/decline_code handling outside payment-flow-modal.
 */
export class StripePaymentError extends Error {
  readonly stripeCode?: string;
  readonly declineCode?: string;

  constructor(
    message: string,
    options?: { stripeCode?: string; declineCode?: string },
  ) {
    super(message);
    this.name = "StripePaymentError";
    this.stripeCode = options?.stripeCode;
    this.declineCode = options?.declineCode;
  }
}

const isPaymentFlowSubmitErrorKey = (
  message: string,
): message is PaymentFlowErrorKey =>
  PAYMENT_FLOW_SUBMIT_ERROR_KEYS.has(message);

/**
 * True when `t()` returned real copy: non-blank and not the key path (missing entry).
 */
const isUsableTranslatedMessage = (
  value: string,
  translationKey: string,
): boolean => Boolean(value.trim()) && value !== translationKey;

const lookupStripeMessage = (
  group: StripeMessageGroup,
  code: string,
): string | null => {
  if (code === STRIPE_LOOKUP_SKIP_CODE) {
    return null;
  }

  const translationKey = `${STRIPE_I18N_ROOT}.${group}.${code}`;
  const value = paymentFlowT(translationKey);
  return isUsableTranslatedMessage(value, translationKey) ? value : null;
};

const resolveStripePaymentErrorMessage = (
  error: StripePaymentError,
): string | null => {
  const { stripeCode, declineCode } = error;
  const parts: string[] = [];

  if (stripeCode && declineCode) {
    const errorCodeMessage = lookupStripeMessage("error_code", stripeCode);
    if (errorCodeMessage) {
      parts.push(errorCodeMessage);
    }
    const declineMessage = lookupStripeMessage("decline_code", declineCode);
    if (declineMessage) {
      parts.push(declineMessage);
    }
  } else if (declineCode) {
    const declineMessage = lookupStripeMessage("decline_code", declineCode);
    if (declineMessage) {
      parts.push(declineMessage);
    }
  } else if (stripeCode) {
    const errorCodeMessage = lookupStripeMessage("error_code", stripeCode);
    if (errorCodeMessage) {
      parts.push(errorCodeMessage);
    } else {
      const errorsMessage = lookupStripeMessage("errors", stripeCode);
      if (errorsMessage) {
        parts.push(errorsMessage);
      }
    }
  }

  if (parts.length > 0) {
    return parts.join(STRIPE_PAYMENT_ERROR_PARTS_SEPARATOR);
  }

  return null;
};

/** New card / SEPA use PaymentElement inline errors; saved methods use the modal alert. */
const isNewStripePaymentElementSelection = (
  selection: PaymentMethodSelectorSelection,
): boolean =>
  selection?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL &&
  (selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.CARD ||
    selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT);

/**
 * Resolves the modal alert message, or `null` when Stripe already surfaces the
 * error inline (PaymentElement validation / new card & SEPA declines).
 */
export const resolveModalSubmitErrorMessage = (
  error: unknown,
  selection: PaymentMethodSelectorSelection,
): string | null => {
  if (
    error instanceof Error &&
    error.message === STRIPE_ELEMENT_VALIDATION_ERROR
  ) {
    return null;
  }

  if (
    error instanceof StripePaymentError &&
    isNewStripePaymentElementSelection(selection)
  ) {
    return null;
  }

  return resolveSubmitErrorMessage(error);
};

/**
 * Maps mutation errors to the translated message displayed in the modal.
 */
export const resolveSubmitErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "customErrorCodes" in error &&
    Array.isArray(error.customErrorCodes)
  ) {
    const firstErrorCode = error.customErrorCodes[0];

    if (firstErrorCode === PAYMENT_BLOCKED_BY_FRAUD_PROTECTION_ERROR_CODE) {
      return paymentFlowT("paymentFlowModal.errors.fraudProtectionBlocked");
    }

    if (firstErrorCode === GIFT_CARD_PAYMENT_ERROR_CODE) {
      return paymentFlowT("paymentFlowModal.errors.giftCardPayment");
    }
  }

  if (error instanceof StripePaymentError) {
    const stripeMessage = resolveStripePaymentErrorMessage(error);
    if (stripeMessage) {
      return stripeMessage;
    }
  }

  if (
    error instanceof Error &&
    error.message &&
    isPaymentFlowSubmitErrorKey(error.message)
  ) {
    return paymentFlowT(error.message);
  }

  return paymentFlowT(SUBMIT_ERROR_FALLBACK);
};
