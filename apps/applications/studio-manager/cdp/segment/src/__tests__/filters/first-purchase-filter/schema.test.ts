import { describe, expect, it } from "vitest";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { firstPurchaseFilterSchema } from "#src/components/filters/first-purchase-filter/schema";

describe("firstPurchaseFilterSchema", () => {
  it("accepts default any-first-purchase form value", () => {
    const value = createDefaultFirstPurchaseFilter(1);

    expect(firstPurchaseFilterSchema.safeParse(value).success).toBe(true);
  });

  it("accepts notDone status", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.firstPurchaseStatus = FIRST_PURCHASE_STATUS.notDone;

    expect(firstPurchaseFilterSchema.safeParse(value).success).toBe(true);
  });
});
