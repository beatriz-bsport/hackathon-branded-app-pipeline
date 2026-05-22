import { describe, expect, it, vi } from "vitest";

import { createDefaultMemberSignUpDateFilter } from "#src/components/filters/member-sign-up-date-filter/default-value";
import { memberSignUpDateFilterSchema } from "#src/components/filters/member-sign-up-date-filter/schema";
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

describe("memberSignUpDateFilterSchema", () => {
  it("rejects an empty absolute sign-up date", () => {
    const value = createDefaultMemberSignUpDateFilter(1);

    const result = memberSignUpDateFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts a valid absolute exact sign-up date", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    value.signUpDate.absolute.fromDate = "2024-06-01";

    const result = memberSignUpDateFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects relative duration when days are missing", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    value.signUpDate = {
      dateType: DATE_FILTER_TYPES.relative,
      absolute: value.signUpDate.absolute,
      relative: {
        operator: RELATIVE_DATE_OPERATORS.pastExactly,
        firstDays: null,
        secondDays: null,
      },
    };

    const result = memberSignUpDateFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts relative duration when days are provided", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    value.signUpDate = {
      dateType: DATE_FILTER_TYPES.relative,
      absolute: value.signUpDate.absolute,
      relative: {
        operator: RELATIVE_DATE_OPERATORS.pastExactly,
        firstDays: 7,
        secondDays: null,
      },
    };

    const result = memberSignUpDateFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between absolute range when the second date is missing", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    value.signUpDate.absolute.operator = ABSOLUTE_DATE_OPERATORS.between;
    value.signUpDate.absolute.fromDate = "2024-01-01";
    value.signUpDate.absolute.toDate = null;

    const result = memberSignUpDateFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
