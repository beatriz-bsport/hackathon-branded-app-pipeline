import { describe, expect, it, vi } from "vitest";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { createDefaultMemberSignUpDateFilter } from "#src/components/filters/member-sign-up-date-filter/default-value";
import { toCreatePayload } from "#src/components/filters/member-sign-up-date-filter/mappers/form-value-to-create-payload";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultMemberSignUpDateFilter(123);

    const payload = toCreatePayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("maps an exact absolute sign-up date", () => {
    const formValue = createDefaultMemberSignUpDateFilter(1);
    formValue.signUpDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-06-01",
        toDate: null,
      },
      relative: formValue.signUpDate.relative,
    };

    const payload = toCreatePayload(formValue);

    expect(payload).toEqual({
      smartlist: 1,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-01",
    });
  });

  it("maps a between absolute sign-up date range", () => {
    const formValue = createDefaultMemberSignUpDateFilter(1);
    formValue.signUpDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
      },
      relative: formValue.signUpDate.relative,
    };

    const payload = toCreatePayload(formValue);

    expect(payload).toEqual({
      smartlist: 1,
      date_filter_type: SmartlistDateFilterType.DATE_BETWEEN,
      date: "2024-01-01",
      date_second: "2024-12-31",
    });
  });

  it("maps a relative duration with signed API offset", () => {
    const formValue = createDefaultMemberSignUpDateFilter(1);
    formValue.signUpDate = {
      dateType: DATE_FILTER_TYPES.relative,
      absolute: formValue.signUpDate.absolute,
      relative: {
        operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
        firstDays: 30,
        secondDays: null,
      },
    };

    const payload = toCreatePayload(formValue);

    expect(payload).toEqual({
      smartlist: 1,
      date_filter_type: SmartlistDateFilterType.DURATION_BEFORE_PAST,
      duration: -30,
    });
  });

  it("maps a relative duration between range", () => {
    const formValue = createDefaultMemberSignUpDateFilter(1);
    formValue.signUpDate = {
      dateType: DATE_FILTER_TYPES.relative,
      absolute: formValue.signUpDate.absolute,
      relative: {
        operator: RELATIVE_DATE_OPERATORS.pastBetween,
        firstDays: 10,
        secondDays: 30,
      },
    };

    const payload = toCreatePayload(formValue);

    expect(payload).toEqual({
      smartlist: 1,
      date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
      duration: -10,
      duration_second: -30,
    });
  });
});
