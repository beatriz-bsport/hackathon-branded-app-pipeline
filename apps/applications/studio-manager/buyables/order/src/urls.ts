export const URLS = {
  INDEX: "..",
} as const;

export const LEGACY_URLS = {
  ORDER_DETAIL: (orderId: string) => `/order/${orderId}/`,
} as const;
