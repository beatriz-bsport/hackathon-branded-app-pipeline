import { i18nInstance, i18nNamespacePrefix } from "#src/i18n";

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

export const isPaymentFlowSubmitErrorKey = (
  message: string,
): message is PaymentFlowErrorKey =>
  PAYMENT_FLOW_SUBMIT_ERROR_KEYS.has(message);

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

  if (
    error instanceof Error &&
    error.message &&
    isPaymentFlowSubmitErrorKey(error.message)
  ) {
    return paymentFlowT(error.message);
  }

  return paymentFlowT(SUBMIT_ERROR_FALLBACK);
};
