import { describe, expect, it, vi } from "vitest";

import { AGE_FILTER_NUMBER_TYPE } from "#src/components/filters/age-filter/constants";
import { createDefaultAgeFilter } from "#src/components/filters/age-filter/default-value";
import { ageFilterSchema } from "#src/components/filters/age-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("ageFilterSchema", () => {
  it("accepts a valid between range", () => {
    const value = createDefaultAgeFilter(1);
    value.type = AGE_FILTER_NUMBER_TYPE.between;
    value.value = 18;
    value.secondValue = 25;

    const result = ageFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts value 0 with greater or equal comparator", () => {
    const value = createDefaultAgeFilter(1);

    const result = ageFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between when second value is missing", () => {
    const value = createDefaultAgeFilter(1);
    value.type = AGE_FILTER_NUMBER_TYPE.between;
    value.value = 18;
    value.secondValue = null;

    const result = ageFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between when second value is below first", () => {
    const value = createDefaultAgeFilter(1);
    value.type = AGE_FILTER_NUMBER_TYPE.between;
    value.value = 25;
    value.secondValue = 18;

    const result = ageFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
