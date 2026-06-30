export const RELATIONS_FILTER_IDENTIFIER = "105";

/**
 * Comparator values for {@link RelationsFilter} (`relations` API).
 * Backend also defines `LT` and `GT`; the segment UI exposes LTE, GTE, EQUAL, and BETWEEN only.
 */
export const SMARTLIST_RELATIONS_COMPARATOR = {
  LTE: 1,
  GTE: 2,
  EQUAL: 5,
  BETWEEN: 6,
} as const;

export type SmartlistRelationsComparator =
  (typeof SMARTLIST_RELATIONS_COMPARATOR)[keyof typeof SMARTLIST_RELATIONS_COMPARATOR];
