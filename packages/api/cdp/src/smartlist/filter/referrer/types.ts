import type { SmartlistFilterPayload } from "../../shared/types";
import type { SmartlistReferrerComparator } from "./constants";

export type { SmartlistReferrerComparator } from "./constants";
export { SMARTLIST_REFERRER_COMPARATOR } from "./constants";

/**
 * Smartlist referrer (has referred) filter.
 * Endpoint family: `/customer-data-platform/v1/smartlist/referrer/`.
 */
export type ReferrerFilter = SmartlistFilterPayload & {
  company_id: number;
  value_referred: number;
  value_second_referred: number;
  comparator_referred: SmartlistReferrerComparator;
  value_obtained_reward_active: boolean;
  value_obtained_reward: number;
  value_second_reward: number;
  comparator_reward: SmartlistReferrerComparator;
  value_obtained_money_active: boolean;
  value_obtained_money: number;
  value_second_obtained_money: number;
  comparator_obtained_money: SmartlistReferrerComparator;
};

export type CreateReferrerFilterPayload = Omit<
  ReferrerFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateReferrerFilterPayload = Partial<
  Omit<ReferrerFilter, "id" | "company_id" | "smartlist" | "filter_identifier">
>;

export type UpsertReferrerFilterVariables = {
  filterId?: number;
  createPayload?: CreateReferrerFilterPayload;
  updatePayload?: UpdateReferrerFilterPayload;
};
