import { IconName } from "@bsport/kaizen-primitive-core";

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
  iconLeft?: IconName;
};

export const ALL_PAYMENT_METHOD_OPTIONS: AllPaymentMethodOption[] = [
  {
    id: "card",
    labelKey: "paymentMethod.selector.allMethodsOptions.card",
    iconLeft: "credit-card-02",
  },
  {
    id: "sepa_debit",
    labelKey: "paymentMethod.selector.allMethodsOptions.sepaDebit",
    iconLeft: "bank",
  },
  {
    id: "gift_card_code",
    labelKey: "paymentMethod.selector.allMethodsOptions.giftCardCode",
    iconLeft: "gift-02",
  },
  {
    id: "account_balance",
    labelKey: "paymentMethod.selector.allMethodsOptions.accountBalance",
    iconLeft: "wallet-04",
  },
  {
    id: "terminal",
    labelKey: "paymentMethod.selector.allMethodsOptions.terminal",
    iconLeft: "payment-terminal",
  },
  {
    id: "manual",
    labelKey: "paymentMethod.selector.allMethodsOptions.manual",
    iconLeft: "user-01",
  },
];

export const DEFAULT_ALL_METHOD_KEY: AllPaymentMethodKey = "card";
