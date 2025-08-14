export const BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY = "bsport-request-from";

export const BSPORT_REQUEST_FROM_HEADER_VALUES = {
  widget: "widget",
  bridge: "bridge",
  "login-router": "login-router",
  "deprecated-payment": "deprecated-payment",
  "consumer-router": "consumer-router",
  "marketplace-router": "marketplace-router",
  "rn-webview": "rn-webview",
  "email-confirmation": "email-confirmation",
  "franchise-backoffice": "franchise-backoffice",
  "account-configuration": "account-configuration",
  backoffice: "backoffice",
} as const;

export type BsportRequestFromHeaderValue =
  keyof typeof BSPORT_REQUEST_FROM_HEADER_VALUES;

/**
 * Set the bsport-request-from header value in sessionStorage.
 * @param value The value to store.
 */
export const setBsportRequestFrom = (value: BsportRequestFromHeaderValue) => {
  sessionStorage?.setItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY, value);
};

/**
 * Get the bsport-request-from header value from sessionStorage.
 * @returns The stored value, or null if not found.
 */
export const getBsportRequestFrom = (): string | null => {
  return sessionStorage?.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY);
};

/**
 * Remove the bsport-request-from header value from localStorage.
 */
export const removeBsportRequestFrom = () => {
  sessionStorage?.removeItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY);
};
