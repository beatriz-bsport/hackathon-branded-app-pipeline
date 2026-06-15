import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultReferrerFilter } from "#src/components/filters/referrer-filter/default-value";
import { referrerFilterSchema } from "#src/components/filters/referrer-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("referrerFilterSchema", () => {
  it("accepts the default create values", () => {
    const value = createDefaultReferrerFilter(1);

    const result = referrerFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts a valid between range", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.BETWEEN;
    value.value_referred = 5;
    value.value_second_referred = 10;

    const result = referrerFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between when second value is below first", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.BETWEEN;
    value.value_referred = 10;
    value.value_second_referred = 2;

    const result = referrerFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
