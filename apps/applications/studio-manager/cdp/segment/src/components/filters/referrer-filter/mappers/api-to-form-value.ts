import type { ReferrerFilter } from "@bsport/api-cdp/smartlist";

import type { ReferrerFilterFormValue } from "../types";

/**
 * Maps a hydrated referrer filter DTO into form state.
 * Preserves sub-filter fields even though only the primary section is rendered.
 */
export const mapReferrerFilterToFormValue = (
  filter: ReferrerFilter,
): ReferrerFilterFormValue => {
  return {
    id: filter.id,
    smartlist: filter.smartlist,
    comparator_referred: filter.comparator_referred,
    value_referred: filter.value_referred ?? 0,
    value_second_referred: filter.value_second_referred ?? 0,
    value_obtained_reward_active: filter.value_obtained_reward_active,
    value_obtained_reward: filter.value_obtained_reward ?? 0,
    value_second_reward: filter.value_second_reward ?? 0,
    comparator_reward: filter.comparator_reward,
    value_obtained_money_active: filter.value_obtained_money_active,
    value_obtained_money: filter.value_obtained_money ?? 0,
    value_second_obtained_money: filter.value_second_obtained_money ?? 0,
    comparator_obtained_money: filter.comparator_obtained_money,
  };
};
