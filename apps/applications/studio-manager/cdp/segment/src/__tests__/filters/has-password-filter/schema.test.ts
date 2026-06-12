import { describe, expect, it } from "vitest";

import { createDefaultHasPasswordFilter } from "#src/components/filters/has-password-filter/default-value";
import { hasPasswordFilterSchema } from "#src/components/filters/has-password-filter/schema";

describe("hasPasswordFilterSchema", () => {
  it("accepts a valid draft has password filter with has set as default", () => {
    const formValue = createDefaultHasPasswordFilter(1);

    const result = hasPasswordFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(true);
    }
  });

  it("accepts a saved has password filter with has not set selected", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: false,
    };

    const result = hasPasswordFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects a non-boolean value", () => {
    const formValue = {
      smartlist: 1,
      value: "yes",
    };

    const result = hasPasswordFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: true,
    };

    const result = hasPasswordFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
