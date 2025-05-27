export const STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE =
  "bsport:payment:currency_code";

export const STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY =
  "bsport:payment:currency_display";

export const DEFAULT_CURRENCY = {
  CODE: "eur",
  DISPLAY: "€",
} as const;

export const STORAGES = {
  LOCAL: "local",
  SESSION: "session",
} as const;

export type StorageType = (typeof STORAGES)[keyof typeof STORAGES];
