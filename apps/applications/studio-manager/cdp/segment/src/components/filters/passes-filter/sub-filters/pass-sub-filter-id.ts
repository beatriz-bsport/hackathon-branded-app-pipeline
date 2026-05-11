/**
 * Stable string identifiers for pass sub-filters (mirrors API semantics and
 * legacy `PASS_SUB_FILTER_TYPES` values).
 */
export const PASS_SUB_FILTER_IDS = {
  purchaseDate: "purchase_date",
  expirationDate: "expiration_date",
  creditLeft: "credit_left",
} as const;

export type PassSubFilterId =
  (typeof PASS_SUB_FILTER_IDS)[keyof typeof PASS_SUB_FILTER_IDS];

export const passSubFilterFielMap = {
  [PASS_SUB_FILTER_IDS.purchaseDate]: "purchaseDate",
  [PASS_SUB_FILTER_IDS.expirationDate]: "expirationDate",
  [PASS_SUB_FILTER_IDS.creditLeft]: "creditLeft",
} as const;

export type PassSubFilterField =
  (typeof passSubFilterFielMap)[keyof typeof passSubFilterFielMap];
