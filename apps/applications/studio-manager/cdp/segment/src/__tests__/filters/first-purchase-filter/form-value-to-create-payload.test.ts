import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { createFirstPurchaseFilterPayload } from "#src/components/filters/first-purchase-filter/mappers/form-value-to-create-payload";

describe("toCreatePayload (first purchase)", () => {
  it("creates a minimal any-first-purchase payload by default", () => {
    const value = createDefaultFirstPurchaseFilter(123);

    const payload = createFirstPurchaseFilterPayload(value);

    expect(payload).toEqual({
      smartlist: 123,
      first_payment_is_done: true,
      date_filter_active: false,
      date: "",
      date_second: "",
      date_filter_type: SmartlistDateFilterType.DURATION_BEFORE,
      duration: 0,
      duration_second: 0,
      value_payment_active: false,
      comparator_payment: SmartlistPaymentComparator.GTE,
      value_payment: 0,
      value_second_payment: 0,
    });
  });

  it("creates never-purchased payload when status is notDone", () => {
    const value = createDefaultFirstPurchaseFilter(5);
    value.firstPurchaseStatus = FIRST_PURCHASE_STATUS.notDone;

    const payload = createFirstPurchaseFilterPayload(value);

    expect(payload.first_payment_is_done).toBe(false);
    expect(payload.value_payment_active).toBe(false);
  });
});
