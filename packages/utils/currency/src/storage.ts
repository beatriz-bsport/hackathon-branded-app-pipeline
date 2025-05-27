import {
  DEFAULT_CURRENCY,
  STORAGES,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY,
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
  try {
    window[`${storage}Storage`].setItem(key, value);
  } catch {
    // Optionally handle storage errors (e.g., quota exceeded)
  }
};

/**
 * Retrieves the stored currency code.
 * Checks sessionStorage first, then localStorage.
 * Defaults to "eur" if not set.
 * @returns The stored currency code (e.g., "eur", "usd").
 */
export const getCurrencyCode = (): string =>
  getItem(STORAGES.SESSION, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) ||
  getItem(STORAGES.LOCAL, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) ||
  DEFAULT_CURRENCY.CODE;

/**
 * Stores the currency code in the specified storage.
 * @param value - The currency code to store (e.g., "eur", "usd").
 * @param storage - The storage type ("local" or "session"). Defaults to "local".
 */
export const setCurrencyCode = (
  value: string,
  storage: StorageType = STORAGES.LOCAL,
): void => setItem(storage, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE, value);

/**
 * Retrieves the stored currency display symbol.
 * Checks sessionStorage first, then localStorage.
 * Defaults to "€" if not set.
 * @returns The stored currency display symbol (e.g., "€", "$").
 */
export const getCurrencyDisplay = (): string =>
  getItem(STORAGES.SESSION, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY) ||
  getItem(STORAGES.LOCAL, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY) ||
  DEFAULT_CURRENCY.DISPLAY;

/**
 * Stores the currency display symbol in the specified storage.
 * @param value - The currency display symbol to store (e.g., "€", "$").
 * @param storage - The storage type ("local" or "session"). Defaults to "local".
 */
export const setCurrencyDisplay = (
  value: string,
  storage: StorageType = STORAGES.LOCAL,
): void => setItem(storage, STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY, value);
