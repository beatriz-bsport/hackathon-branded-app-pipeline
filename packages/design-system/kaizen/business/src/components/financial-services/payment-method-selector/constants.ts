export type AllPaymentMethodKey =
  | "card"
  | "sepa_debit"
  | "gift_card_code"
  | "account_balance"
  | "terminal"
  | "manual";

type AllPaymentMethodOption = {
  id: AllPaymentMethodKey;
  labelKey:
    | "paymentMethod.selector.allMethodsOptions.card"
    | "paymentMethod.selector.allMethodsOptions.sepaDebit"
    | "paymentMethod.selector.allMethodsOptions.giftCardCode"
    | "paymentMethod.selector.allMethodsOptions.accountBalance"
    | "paymentMethod.selector.allMethodsOptions.terminal"
    | "paymentMethod.selector.allMethodsOptions.manual";
};

export const ALL_PAYMENT_METHOD_OPTIONS: AllPaymentMethodOption[] = [
  {
    id: "card",
    labelKey: "paymentMethod.selector.allMethodsOptions.card",
  },
  {
    id: "sepa_debit",
    labelKey: "paymentMethod.selector.allMethodsOptions.sepaDebit",
  },
  {
    id: "gift_card_code",
    labelKey: "paymentMethod.selector.allMethodsOptions.giftCardCode",
  },
  {
    id: "account_balance",
    labelKey: "paymentMethod.selector.allMethodsOptions.accountBalance",
  },
  {
    id: "terminal",
    labelKey: "paymentMethod.selector.allMethodsOptions.terminal",
  },
  {
    id: "manual",
    labelKey: "paymentMethod.selector.allMethodsOptions.manual",
  },
];

export const DEFAULT_ALL_METHOD_KEY: AllPaymentMethodKey = "card";
