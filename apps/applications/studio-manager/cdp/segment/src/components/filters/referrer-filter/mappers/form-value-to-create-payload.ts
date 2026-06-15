import type {
  ReferrerFilterCreatePayload,
  ReferrerFilterFormValue,
} from "../types";

/**
 * Builds the POST body for a new referrer filter row.
 */
export const toCreatePayload = (
  value: ReferrerFilterFormValue,
): ReferrerFilterCreatePayload => ({
  smartlist: value.smartlist,
  comparator_referred: value.comparator_referred,
  value_referred: value.value_referred,
  value_second_referred: value.value_second_referred,
  value_obtained_reward_active: value.value_obtained_reward_active,
  value_obtained_reward: value.value_obtained_reward,
  value_second_reward: value.value_second_reward,
  comparator_reward: value.comparator_reward,
  value_obtained_money_active: value.value_obtained_money_active,
  value_obtained_money: value.value_obtained_money,
  value_second_obtained_money: value.value_second_obtained_money,
  comparator_obtained_money: value.comparator_obtained_money,
});
