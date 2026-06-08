import { describe, expect, it, vi } from "vitest";

import { createDefaultLastBookingFilter } from "#src/components/filters/last-booking-filter/default-value";
import { lastBookingFilterSchema } from "#src/components/filters/last-booking-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("lastBookingFilterSchema", () => {
  it("rejects a draft with no days value", () => {
    const formValue = createDefaultLastBookingFilter(1);

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["value"]);
    }
  });

  it("rejects a value below 1", () => {
    const formValue = createDefaultLastBookingFilter(1);
    formValue.value = 0;

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("accepts a valid days value of 1", () => {
    const formValue = createDefaultLastBookingFilter(1);
    formValue.value = 1;

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("accepts large day values", () => {
    const formValue = createDefaultLastBookingFilter(1);
    formValue.value = 365;

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("accepts a saved filter with id and days value", () => {
    const formValue = {
      id: 12,
      smartlist: 7,
      value: 30,
    };

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects a missing smartlist id", () => {
    const formValue = {
      value: 30,
    };

    const result = lastBookingFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
