import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import { REFERRED_MEMBER_STATUS } from "./constants";
import type { ReferredMembersFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new referred member filter card.
 *
 * Matches backend model defaults: `is_referred: true`, money sub-filter off.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultReferredMembersFilter = (
  smartlistId: number,
): ReferredMembersFilterFormValue => ({
  smartlist: smartlistId,
  referredStatus: REFERRED_MEMBER_STATUS.referred,
  subFilters: [],
  moneyObtained: defaultNumericComparatorFilterValue,
});
