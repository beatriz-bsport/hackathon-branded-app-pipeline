import {
  type CreateReferredMemberFilterPayload,
  SmartlistReferralMoneyComparator,
} from "@bsport/api-cdp/smartlist";

import { isReferredStatusToApi } from "../constants";
import { REGISTERED_REFERRED_MEMBERS_SUB_FILTERS } from "../sub-filters/registry";
import type { ReferredMembersFilterFormValue } from "../types";

/**
 * Builds the `POST /referred_members/` payload from a form value.
 */
export const createReferredMembersFilterPayload = (
  value: ReferredMembersFilterFormValue,
): CreateReferredMemberFilterPayload => {
  const subFilterSlices = REGISTERED_REFERRED_MEMBERS_SUB_FILTERS.reduce<
    Partial<CreateReferredMemberFilterPayload>
  >(
    (accumulator, subFilterModule) => ({
      ...accumulator,
      ...subFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    is_referred: isReferredStatusToApi(value.referredStatus),
    money_obtained_active: false,
    money_obtained_comparator: SmartlistReferralMoneyComparator.GTE,
    money_obtained: 0,
    money_obtained_second: 0,
    ...subFilterSlices,
  };
};
