export const REFERRER_FILTER_IDENTIFIER = "29";

/**
 * Comparator values for {@link ReferrerFilter} (`referrer` API).
 * Backend also defines `LT` and `GT`; the segment UI exposes LTE, GTE, EQUAL, and BETWEEN only.
 */
export const SMARTLIST_REFERRER_COMPARATOR = {
  LTE: 1,
  GTE: 2,
  EQUAL: 5,
  BETWEEN: 6,
} as const;

export type SmartlistReferrerComparator =
  (typeof SMARTLIST_REFERRER_COMPARATOR)[keyof typeof SMARTLIST_REFERRER_COMPARATOR];
