import { describe, expect, it, vi } from "vitest";

import { REFERRED_MEMBER_STATUS } from "#src/components/filters/referred-members-filter/constants";
import { createDefaultReferredMembersFilter } from "#src/components/filters/referred-members-filter/default-value";
import { referredMembersFilterSchema } from "#src/components/filters/referred-members-filter/schema";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "#src/components/filters/referred-members-filter/sub-filters/referred-members-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("referredMembersFilterSchema", () => {
  it("accepts default referred member form value", () => {
    const value = createDefaultReferredMembersFilter(1);

    expect(referredMembersFilterSchema.safeParse(value).success).toBe(true);
  });

  it("accepts notReferred status", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.referredStatus = REFERRED_MEMBER_STATUS.notReferred;

    expect(referredMembersFilterSchema.safeParse(value).success).toBe(true);
  });

  it("rejects active money sub-filter without a value", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: null,
      secondValue: null,
    };

    const result = referredMembersFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("does not validate money sub-filter when status is notReferred", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.referredStatus = REFERRED_MEMBER_STATUS.notReferred;
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: null,
      secondValue: null,
    };

    expect(referredMembersFilterSchema.safeParse(value).success).toBe(true);
  });

  it("rejects between range when second value is lower than first", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.between,
      firstValue: 50,
      secondValue: 10,
    };

    const result = referredMembersFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
