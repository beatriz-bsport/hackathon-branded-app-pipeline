/**
 * Stable string identifiers for pass sub-filters (mirrors API semantics and
 * legacy `PASS_SUB_FILTER_TYPES` values).
 */
export const PASS_SUB_FILTER_IDS = {
  purchaseDate: "purchase_date",
  expirationDate: "expiration_date",
} as const;

export type PassSubFilterId =
  (typeof PASS_SUB_FILTER_IDS)[keyof typeof PASS_SUB_FILTER_IDS];

export const passSubFilterFielMap = {
  [PASS_SUB_FILTER_IDS.purchaseDate]: "purchaseDate",
  [PASS_SUB_FILTER_IDS.expirationDate]: "expirationDate",
} as const;

export type PassSubFilterField =
  (typeof passSubFilterFielMap)[keyof typeof passSubFilterFielMap];
