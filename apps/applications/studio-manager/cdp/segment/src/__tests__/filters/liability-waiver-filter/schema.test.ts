import { describe, expect, it } from "vitest";

import { createDefaultLiabilityWaiverFilter } from "#src/components/filters/liability-waiver-filter/default-value";
import { liabilityWaiverFilterSchema } from "#src/components/filters/liability-waiver-filter/schema";

describe("liabilityWaiverFilterSchema", () => {
  it("accepts a valid draft liability waiver filter with accepted as default", () => {
    const formValue = createDefaultLiabilityWaiverFilter(1);

    const result = liabilityWaiverFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(true);
    }
  });

  it("accepts a saved liability waiver filter with not accepted selected", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: false,
    };

    const result = liabilityWaiverFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects a non-boolean value", () => {
    const formValue = {
      smartlist: 1,
      value: "yes",
    };

    const result = liabilityWaiverFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: true,
    };

    const result = liabilityWaiverFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
