import { describe, expect, it } from "vitest";

import { SmartlistReferralMoneyComparator } from "@bsport/api-cdp/smartlist";

import { REFERRED_MEMBER_STATUS } from "#src/components/filters/referred-members-filter/constants";
import { createDefaultReferredMembersFilter } from "#src/components/filters/referred-members-filter/default-value";
import { buildReferredMembersFilterDirtyPatch } from "#src/components/filters/referred-members-filter/mappers/build-dirty-patch";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "#src/components/filters/referred-members-filter/sub-filters/referred-members-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("buildReferredMembersFilterDirtyPatch", () => {
  it("patches is_referred when status is dirty", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.referredStatus = REFERRED_MEMBER_STATUS.notReferred;

    const payload = buildReferredMembersFilterDirtyPatch(
      { referredStatus: true },
      value,
    );

    expect(payload).toEqual({
      is_referred: false,
      money_obtained_active: false,
    });
  });

  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultReferredMembersFilter(1);

    const payload = buildReferredMembersFilterDirtyPatch({}, value);

    expect(payload).toEqual({});
  });

  it("patches money slice when money obtained sub-filter is dirty", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: 30,
      secondValue: null,
    };

    const payload = buildReferredMembersFilterDirtyPatch(
      { moneyObtained: { firstValue: true } },
      value,
    );

    expect(payload.money_obtained_active).toBe(true);
    expect(payload.money_obtained_comparator).toBe(
      SmartlistReferralMoneyComparator.GTE,
    );
    expect(payload.money_obtained).toBe(30);
  });

  it("deactivates money slice when sub-filter is removed", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [];

    const payload = buildReferredMembersFilterDirtyPatch(
      { subFilters: [true] },
      value,
    );

    expect(payload.money_obtained_active).toBe(false);
  });
});
