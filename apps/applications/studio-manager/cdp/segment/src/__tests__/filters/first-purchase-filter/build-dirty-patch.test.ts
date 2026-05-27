import { describe, expect, it } from "vitest";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/first-purchase-filter/mappers/build-dirty-patch";

describe("buildDirtyPatchPayload (first purchase)", () => {
  it("patches first_payment_is_done when status is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.firstPurchaseStatus = FIRST_PURCHASE_STATUS.notDone;

    const payload = buildDirtyPatchPayload(
      { firstPurchaseStatus: true },
      value,
    );

    expect(payload).toEqual({ first_payment_is_done: false });
  });

  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);

    const payload = buildDirtyPatchPayload({}, value);

    expect(payload).toEqual({});
  });
});
