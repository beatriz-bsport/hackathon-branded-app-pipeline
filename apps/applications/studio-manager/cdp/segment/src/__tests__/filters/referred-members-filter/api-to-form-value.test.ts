import { describe, expect, it } from "vitest";

import { SmartlistReferralMoneyComparator } from "@bsport/api-cdp/smartlist";

import { REFERRED_MEMBER_STATUS } from "#src/components/filters/referred-members-filter/constants";
import { mapReferredMemberFilterToFormValue } from "#src/components/filters/referred-members-filter/mappers/api-to-form-value";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "#src/components/filters/referred-members-filter/sub-filters/referred-members-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

const baseApiFilter = {
  id: 91,
  smartlist: 123,
  company_id: 7,
  filter_identifier: 30,
  is_referred: true,
  money_obtained_active: false,
  money_obtained_comparator: SmartlistReferralMoneyComparator.GTE,
  money_obtained: 0,
  money_obtained_second: 0,
};

describe("mapReferredMemberFilterToFormValue", () => {
  it("maps is_referred true to referred status", () => {
    const formValue = mapReferredMemberFilterToFormValue(baseApiFilter);

    expect(formValue.id).toBe(91);
    expect(formValue.smartlist).toBe(123);
    expect(formValue.referredStatus).toBe(REFERRED_MEMBER_STATUS.referred);
    expect(formValue.subFilters).toEqual([]);
  });

  it("maps is_referred false to notReferred status", () => {
    const formValue = mapReferredMemberFilterToFormValue({
      ...baseApiFilter,
      is_referred: false,
    });

    expect(formValue.referredStatus).toBe(REFERRED_MEMBER_STATUS.notReferred);
  });

  it("hydrates active money obtained sub-filter from API", () => {
    const formValue = mapReferredMemberFilterToFormValue({
      ...baseApiFilter,
      money_obtained_active: true,
      money_obtained_comparator: SmartlistReferralMoneyComparator.EQUAL,
      money_obtained: 30,
      money_obtained_second: 0,
    });

    expect(formValue.subFilters).toEqual([
      REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained,
    ]);
    expect(formValue.moneyObtained.operator).toBe(
      NUMERIC_COMPARATOR_OPERATORS.equal,
    );
    expect(formValue.moneyObtained.firstValue).toBe(30);
  });

  it("hydrates between money comparator with second value", () => {
    const formValue = mapReferredMemberFilterToFormValue({
      ...baseApiFilter,
      money_obtained_active: true,
      money_obtained_comparator: SmartlistReferralMoneyComparator.BETWEEN,
      money_obtained: 10,
      money_obtained_second: 50,
    });

    expect(formValue.moneyObtained.operator).toBe(
      NUMERIC_COMPARATOR_OPERATORS.between,
    );
    expect(formValue.moneyObtained.secondValue).toBe(50);
  });
});
