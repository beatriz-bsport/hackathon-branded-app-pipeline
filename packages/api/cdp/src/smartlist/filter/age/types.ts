import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Comparator values for {@link AgeFilter} (`age` API).
 * Backend also defines `LT` and `GT`; the segment UI exposes LTE, GTE, EQUAL, and BETWEEN only.
 */
export enum AgeFilterComparator {
  LTE = 1,
  GTE = 2,
  LT = 3,
  GT = 4,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist member age filter.
 * Endpoint family: `/customer-data-platform/v1/smartlist/age/`
 */
export type AgeFilter = SmartlistFilterPayload & {
  company: number;
  comparator: AgeFilterComparator;
  value: number;
  value_second: number;
};

export type CreateAgeFilterPayload = Omit<
  AgeFilter,
  "id" | "company" | "filter_identifier"
>;

export type UpdateAgeFilterPayload = Partial<
  Omit<AgeFilter, "id" | "company" | "smartlist" | "filter_identifier">
>;
