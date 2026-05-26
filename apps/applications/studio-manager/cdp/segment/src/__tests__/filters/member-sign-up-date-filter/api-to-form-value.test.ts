import { describe, expect, it } from "vitest";

import {
  type MemberDateJoinedFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { mapMemberDateJoinedFilterToFormValue } from "#src/components/filters/member-sign-up-date-filter/mappers/api-to-form-value";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

const baseFilter: MemberDateJoinedFilter = {
  id: 88,
  company_id: 7,
  smartlist: 123,
  filter_identifier: 18,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: "2024-06-01",
  date_second: null,
  duration: 0,
  duration_second: 0,
};

describe("mapMemberDateJoinedFilterToFormValue", () => {
  it("maps ids and absolute exact date from API", () => {
    const formValue = mapMemberDateJoinedFilterToFormValue(baseFilter);

    expect(formValue.id).toBe(88);
    expect(formValue.smartlist).toBe(123);
    expect(formValue.signUpDate.dateType).toBe(DATE_FILTER_TYPES.absolute);
    expect(formValue.signUpDate.absolute.operator).toBe(
      ABSOLUTE_DATE_OPERATORS.exactlyOn,
    );
    expect(formValue.signUpDate.absolute.fromDate).toBe("2024-06-01");
  });

  it("maps positive duration days from API into the form", () => {
    const formValue = mapMemberDateJoinedFilterToFormValue({
      ...baseFilter,
      date_filter_type: SmartlistDateFilterType.DURATION_BEFORE_PAST,
      date: null,
      duration: -30,
      duration_second: 0,
    });

    expect(formValue.signUpDate.dateType).toBe(DATE_FILTER_TYPES.relative);
    expect(formValue.signUpDate.relative.operator).toBe(
      RELATIVE_DATE_OPERATORS.pastMoreThan,
    );
    expect(formValue.signUpDate.relative.firstDays).toBe(30);
  });
});
