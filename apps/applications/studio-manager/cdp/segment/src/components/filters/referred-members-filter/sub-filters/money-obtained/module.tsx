import {
  type CreateReferredMemberFilterPayload,
  type ReferredMemberFilter,
  SmartlistReferralMoneyComparator,
} from "@bsport/api-cdp/smartlist";

import { isReferredStatusToApi } from "#src/components/filters/referred-members-filter/constants";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { ReferredMembersFilterFormValue } from "../../types";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "../referred-members-sub-filter-id";
import type { ReferredMembersSubFilterModule } from "../referred-members-sub-filter-module-contract";
import { MoneyObtainedSubFilterSection } from "./component";
import { refineMoneyObtainedSubFilter } from "./schema";
import {
  mapReferralMoneyComparator,
  toFormMoneyObtainedSection,
  toNumericApiValue,
} from "./utils";

const MONEY_OBTAINED_INACTIVE_API_SLICE: Partial<CreateReferredMemberFilterPayload> =
  {
    money_obtained_active: false,
    money_obtained_comparator: SmartlistReferralMoneyComparator.GTE,
    money_obtained: 0,
    money_obtained_second: 0,
  };

const toMoneyObtainedApiSlice = (
  value: ReferredMembersFilterFormValue,
): Partial<CreateReferredMemberFilterPayload> => {
  if (
    !isReferredStatusToApi(value.referredStatus) ||
    !value.subFilters.includes(REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained)
  ) {
    return MONEY_OBTAINED_INACTIVE_API_SLICE;
  }

  return {
    money_obtained_active: true,
    money_obtained_comparator: mapReferralMoneyComparator(
      value.moneyObtained.operator,
    ),
    money_obtained: toNumericApiValue(value.moneyObtained.firstValue),
    money_obtained_second: toNumericApiValue(value.moneyObtained.secondValue),
  };
};

export const moneyObtainedReferredMembersSubFilterModule: ReferredMembersSubFilterModule =
  {
    id: REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained,
    labelKey: "filters.30.subFilters.moneyObtained",
    Section: MoneyObtainedSubFilterSection,
    refine: refineMoneyObtainedSubFilter,
    readFromApi: (filter: ReferredMemberFilter) => ({
      isActive: filter.money_obtained_active === true,
      partial: {
        moneyObtained: toFormMoneyObtainedSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toMoneyObtainedApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const moneyObtainedDirty = hasNestedDirty(dirtyFields.moneyObtained);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !moneyObtainedDirty && !subFiltersTouched) {
        return {};
      }
      return toMoneyObtainedApiSlice(value);
    },
  };
