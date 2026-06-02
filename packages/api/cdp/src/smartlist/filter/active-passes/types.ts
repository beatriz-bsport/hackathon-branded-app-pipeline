import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Comparator values for {@link ActivePassesFilter} (`active_passes` API).
 * Values 3 (LT) and 4 (GT) are not implemented in `do_filter` on the backend.
 */
export enum SmartlistActivePassesComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist active passes filter data contract (filter identifier 27).
 * Counts how many group passes (ConsumerPaymentPack) + private passes
 * (PrivateConsumerPass) are active right now for each member and compares
 * the result against the configured threshold.
 * Endpoint family: `/customer-data-platform/v1/smartlist/active_passes/`
 */
export type ActivePassesFilter = SmartlistFilterPayload & {
  company_id: number;
  select_all_payment_packs: boolean;
  payment_packs: number[];
  select_all_private_passes: boolean;
  private_passes: number[];
  nb_active_passes_comparator: SmartlistActivePassesComparator;
  nb_active_passes_value: number;
  nb_active_passes_value_second: number;
};

export type CreateActivePassesFilterPayload = Omit<
  ActivePassesFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateActivePassesFilterPayload = Partial<
  Omit<
    ActivePassesFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
