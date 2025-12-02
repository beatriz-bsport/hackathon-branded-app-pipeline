import {
  STORAGES,
  STORAGE_KEY_BSPORT_COMPANY_TIMEZONE,
  type StorageType,
} from "./constants";

/**
 * Safely retrieves a string value from the specified storage.
 * @param storage - The storage type ("local" or "session").
 * @param key - The key to retrieve.
 * @returns The stored value, or null if not found or on error.
 */
const getItem = (storage: StorageType, key: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window[`${storage}Storage`]?.getItem(key) ?? null;
};

const STORAGE_TYPE_MAP = {
  [STORAGES.LOCAL]: "localStorage",
  [STORAGES.SESSION]: "sessionStorage",
};
/**
 * Safely sets a string value in the specified storage.
 * @param storage - The storage type ("local" or "session").
 * @param key - The key to set.
 * @param value - The value to store.
 */
const setItem = (storage: StorageType, key: string, value: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  const storageType = STORAGE_TYPE_MAP[storage] as
    | "localStorage"
    | "sessionStorage";
  try {
    window[storageType].setItem(key, value);
  } catch {
    console.error(`Failed to set item in ${storage}Storage`);
  }
};

/**
 * Retrieves the stored timezone.
 * Checks sessionStorage first, then localStorage.
 * Defaults to browser's timezone if none is stored.
 * @returns The stored timezone (e.g., "Europe/Paris", "America/Toronto").
 */
export const getCompanyTimezone = (): string =>
  getItem(STORAGES.SESSION, STORAGE_KEY_BSPORT_COMPANY_TIMEZONE) ||
  getItem(STORAGES.LOCAL, STORAGE_KEY_BSPORT_COMPANY_TIMEZONE) ||
  Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Stores the timezone in the specified storage.
 * @param value - The timezone to store (e.g., "Europe/Paris", "America/Toronto").
 * @param storage - The storage type ("local" or "session"). Defaults to "local".
 */
export const setCompanyTimezone = (
  value: string,
  storage: StorageType = STORAGES.LOCAL,
): void => setItem(storage, STORAGE_KEY_BSPORT_COMPANY_TIMEZONE, value);
