import { describe, expect, it } from "vitest";

import { createDefaultHasPhoneFilter } from "#src/components/filters/has-phone-filter/default-value";
import { hasPhoneFilterSchema } from "#src/components/filters/has-phone-filter/schema";

describe("hasPhoneFilterSchema", () => {
  it("accepts a valid draft has phone filter with has phone as default", () => {
    const formValue = createDefaultHasPhoneFilter(1);

    const result = hasPhoneFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(true);
    }
  });

  it("accepts a saved has phone filter with does not have phone selected", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: false,
    };

    const result = hasPhoneFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects a non-boolean value", () => {
    const formValue = {
      smartlist: 1,
      value: "yes",
    };

    const result = hasPhoneFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: true,
    };

    const result = hasPhoneFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
