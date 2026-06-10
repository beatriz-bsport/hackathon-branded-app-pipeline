import { describe, expect, it } from "vitest";

import { SmartlistReferralMoneyComparator } from "@bsport/api-cdp/smartlist";

import { REFERRED_MEMBER_STATUS } from "#src/components/filters/referred-members-filter/constants";
import { createDefaultReferredMembersFilter } from "#src/components/filters/referred-members-filter/default-value";
import { createReferredMembersFilterPayload } from "#src/components/filters/referred-members-filter/mappers/form-value-to-create-payload";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "#src/components/filters/referred-members-filter/sub-filters/referred-members-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("createReferredMembersFilterPayload", () => {
  it("creates a minimal referred member payload by default", () => {
    const value = createDefaultReferredMembersFilter(123);

    const payload = createReferredMembersFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      is_referred: true,
      money_obtained_active: false,
      money_obtained_comparator: SmartlistReferralMoneyComparator.GTE,
      money_obtained: 0,
      money_obtained_second: 0,
    });
  });

  it("creates not-referred payload when status is notReferred", () => {
    const value = createDefaultReferredMembersFilter(5);
    value.referredStatus = REFERRED_MEMBER_STATUS.notReferred;

    const payload = createReferredMembersFilterPayload(value);

    expect(payload.is_referred).toBe(false);
    expect(payload.money_obtained_active).toBe(false);
  });

  it("activates money fields when money obtained sub-filter is selected", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      firstValue: 50,
      secondValue: null,
    };

    const payload = createReferredMembersFilterPayload(value);

    expect(payload.money_obtained_active).toBe(true);
    expect(payload.money_obtained_comparator).toBe(
      SmartlistReferralMoneyComparator.LTE,
    );
    expect(payload.money_obtained).toBe(50);
    expect(payload.money_obtained_second).toBe(0);
  });

  it("activates between money with second value", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.between,
      firstValue: 20,
      secondValue: 100,
    };

    const payload = createReferredMembersFilterPayload(value);

    expect(payload.money_obtained_active).toBe(true);
    expect(payload.money_obtained_comparator).toBe(
      SmartlistReferralMoneyComparator.BETWEEN,
    );
    expect(payload.money_obtained).toBe(20);
    expect(payload.money_obtained_second).toBe(100);
  });

  it("does not activate money sub-filter when status is notReferred", () => {
    const value = createDefaultReferredMembersFilter(1);
    value.referredStatus = REFERRED_MEMBER_STATUS.notReferred;
    value.subFilters = [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained];
    value.moneyObtained = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: 10,
      secondValue: null,
    };

    const payload = createReferredMembersFilterPayload(value);

    expect(payload.is_referred).toBe(false);
    expect(payload.money_obtained_active).toBe(false);
  });
});
