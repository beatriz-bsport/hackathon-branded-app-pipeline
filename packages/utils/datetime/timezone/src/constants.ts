export const STORAGE_KEY_BSPORT_COMPANY_TIMEZONE = "bsport:company:timezone";

export const STORAGES = {
  LOCAL: "local",
  SESSION: "session",
} as const;

export const DEFAULT_TIMEZONE = "Europe/Paris";

export type StorageType = (typeof STORAGES)[keyof typeof STORAGES];
