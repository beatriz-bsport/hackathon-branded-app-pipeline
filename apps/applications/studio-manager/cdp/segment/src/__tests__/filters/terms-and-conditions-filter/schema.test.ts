import { describe, expect, it } from "vitest";

import { createDefaultTermsAndConditionsFilter } from "#src/components/filters/terms-and-conditions-filter/default-value";
import { termsAndConditionsFilterSchema } from "#src/components/filters/terms-and-conditions-filter/schema";

describe("termsAndConditionsFilterSchema", () => {
  it("accepts a valid draft terms and conditions filter with accepted as default", () => {
    const formValue = createDefaultTermsAndConditionsFilter(1);

    const result = termsAndConditionsFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(true);
    }
  });

  it("accepts a saved terms and conditions filter with not accepted selected", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: false,
    };

    const result = termsAndConditionsFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects a non-boolean value", () => {
    const formValue = {
      smartlist: 1,
      value: "yes",
    };

    const result = termsAndConditionsFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: true,
    };

    const result = termsAndConditionsFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
