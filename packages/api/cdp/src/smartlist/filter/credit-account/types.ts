import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Comparator values for {@link CreditAccountFilter} (`credit_account_filter` API).
 * Backend also defines `LT` and `GT`; the segment UI currently exposes LTE, GTE, EQUAL, and BETWEEN only.
 */
export enum SmartlistCreditAccountFilterComparator {
  LTE = 1,
  GTE = 2,
  // Not used in the segment UI, but the backend defines it
  LT = 3,
  // Not used in the segment UI, but the backend defines it
  GT = 4,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist credit account (member balance) filter.
 * Endpoint family: `/customer-data-platform/v1/smartlist/credit_account_filter/`
 */
export type CreditAccountFilter = SmartlistFilterPayload & {
  company_id: number;
  comparator: SmartlistCreditAccountFilterComparator;
  value: number;
  // This field is not nullable, so even if you compare with only one value, you need to provide a value_second
  value_second: number;
};

export type CreateCreditAccountFilterPayload = Omit<
  CreditAccountFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateCreditAccountFilterPayload = Partial<
  Omit<
    CreditAccountFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
