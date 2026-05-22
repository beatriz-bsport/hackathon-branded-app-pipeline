import { describe, expect, it } from "vitest";

import { GENDER_OPTIONS } from "#src/components/filters/gender-filter/constants";
import { createDefaultGenderFilter } from "#src/components/filters/gender-filter/default-value";
import { genderFilterSchema } from "#src/components/filters/gender-filter/schema";

describe("genderFilterSchema", () => {
  it("accepts a valid draft gender filter with male as default", () => {
    const formValue = createDefaultGenderFilter(1);

    const result = genderFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(GENDER_OPTIONS.male);
    }
  });

  it("accepts a saved gender filter with female selected", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: GENDER_OPTIONS.female,
    };

    const result = genderFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid gender value", () => {
    const formValue = {
      smartlist: 1,
      value: "X",
    };

    const result = genderFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: GENDER_OPTIONS.male,
    };

    const result = genderFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
