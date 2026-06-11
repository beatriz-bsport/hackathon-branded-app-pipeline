import type { ReferredMemberFilter } from "@bsport/api-cdp/smartlist";

import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import { isReferredStatusFromApi } from "../constants";
import { REGISTERED_REFERRED_MEMBERS_SUB_FILTERS } from "../sub-filters/registry";
import type { ReferredMembersFilterFormValue } from "../types";

/**
 * Converts a server-side `ReferredMemberFilter` payload into the UI form value.
 */
export const mapReferredMemberFilterToFormValue = (
  filter: ReferredMemberFilter,
): ReferredMembersFilterFormValue => {
  const subFilters: ReferredMembersFilterFormValue["subFilters"] = [];
  const partialForm: Partial<ReferredMembersFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_REFERRED_MEMBERS_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    referredStatus: isReferredStatusFromApi(filter.is_referred),
    subFilters,
    moneyObtained:
      partialForm.moneyObtained ?? defaultNumericComparatorFilterValue,
  };
};
