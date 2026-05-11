import { IconName } from "@bsport/kaizen-primitive-core";

/**
 * Ids for entries under "All methods" in {@link PaymentMethodSelector}.
 * Keep aligned with payment-flow routing and API expectations.
 */
export const ALL_PAYMENT_METHOD_SELECTOR_ID = {
  CARD: "card",
  SEPA_DEBIT: "sepa_debit",
  GIFT_CARD_CODE: "gift_card_code",
  ACCOUNT_BALANCE: "account_balance",
  TERMINAL: "terminal",
  MANUAL: "manual",
} as const;

export type AllPaymentMethodKey =
  (typeof ALL_PAYMENT_METHOD_SELECTOR_ID)[keyof typeof ALL_PAYMENT_METHOD_SELECTOR_ID];

export const SAVED_PAYMENT_METHOD_TYPE = {
  CARD: ALL_PAYMENT_METHOD_SELECTOR_ID.CARD,
  SEPA_DEBIT: ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT,
  BACS_DEBIT: "bacs_debit",
} as const;

export type SavedPaymentMethodDiscriminator =
  (typeof SAVED_PAYMENT_METHOD_TYPE)[keyof typeof SAVED_PAYMENT_METHOD_TYPE];

/** Logo asset ids used when mapping saved payment methods to `PaymentMethodLogo`. */
export const SAVED_METHOD_LOGO_TYPE = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  SEPA_DEBIT: "sepa_debit",
  BACS_DEBIT: "bacs_debit",
} as const;

type AllPaymentMethodOption = {
  id: AllPaymentMethodKey;
  labelKey:
    | "paymentMethod.selector.allMethodsOptions.card"
    | "paymentMethod.selector.allMethodsOptions.sepaDebit"
    | "paymentMethod.selector.allMethodsOptions.giftCardCode"
    | "paymentMethod.selector.allMethodsOptions.accountBalance"
    | "paymentMethod.selector.allMethodsOptions.terminal"
    | "paymentMethod.selector.allMethodsOptions.manual";
  iconLeft?: IconName;
};

export const ALL_PAYMENT_METHOD_OPTIONS: AllPaymentMethodOption[] = [
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.CARD,
    labelKey: "paymentMethod.selector.allMethodsOptions.card",
    iconLeft: "credit-card-02",
  },
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT,
    labelKey: "paymentMethod.selector.allMethodsOptions.sepaDebit",
    iconLeft: "bank",
  },
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE,
    labelKey: "paymentMethod.selector.allMethodsOptions.giftCardCode",
    iconLeft: "gift-02",
  },
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE,
    labelKey: "paymentMethod.selector.allMethodsOptions.accountBalance",
    iconLeft: "wallet-04",
  },
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL,
    labelKey: "paymentMethod.selector.allMethodsOptions.terminal",
    iconLeft: "payment-terminal",
  },
  {
    id: ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL,
    labelKey: "paymentMethod.selector.allMethodsOptions.manual",
    iconLeft: "user-01",
  },
];

export const DEFAULT_ALL_METHOD_KEY: AllPaymentMethodKey =
  ALL_PAYMENT_METHOD_SELECTOR_ID.CARD;
