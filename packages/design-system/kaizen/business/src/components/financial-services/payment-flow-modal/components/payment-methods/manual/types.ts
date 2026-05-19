export const MANUAL_METHOD_TYPES = [
  "card_manual_machine",
  "cash",
  "check",
  "vacation_check",
  "american_express",
  "transfer",
  "other",
  "client_credit_balance",
] as const;

export type ManualMethodType = (typeof MANUAL_METHOD_TYPES)[number];

export const DEFAULT_MANUAL_PAYMENT_METHOD: ManualMethodType =
  "card_manual_machine";

export const isManualMethodType = (value: string): value is ManualMethodType =>
  MANUAL_METHOD_TYPES.some((item) => item === value);
