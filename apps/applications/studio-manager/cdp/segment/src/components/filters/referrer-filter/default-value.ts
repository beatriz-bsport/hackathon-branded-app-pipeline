import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";

import type { ReferrerFilterFormValue } from "./types";

/**
 * Default form values for a new referrer filter row (at least one referral).
 */
export const createDefaultReferrerFilter = (
  smartlistId: number,
): ReferrerFilterFormValue => ({
  smartlist: smartlistId,
  comparator_referred: SMARTLIST_REFERRER_COMPARATOR.GTE,
  value_referred: 1,
  value_second_referred: 0,
  value_obtained_reward_active: false,
  value_obtained_reward: 0,
  value_second_reward: 0,
  comparator_reward: SMARTLIST_REFERRER_COMPARATOR.GTE,
  value_obtained_money_active: false,
  value_obtained_money: 0,
  value_second_obtained_money: 0,
  comparator_obtained_money: SMARTLIST_REFERRER_COMPARATOR.GTE,
});
