import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/first-purchase-filter/mappers/build-dirty-patch";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "#src/components/filters/first-purchase-filter/sub-filters/first-purchase-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

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

  it("patches date slice when purchase date sub-filter is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-05-10",
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const payload = buildDirtyPatchPayload(
      { purchaseDate: { absolute: { fromDate: true } } },
      value,
    );

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_EXACT);
    expect(payload.date).toBe("2024-05-10");
  });

  it("patches date slice when subFilters array is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.onOrAfter,
        fromDate: "2024-01-15",
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const payload = buildDirtyPatchPayload({ subFilters: [true] }, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_AFTER);
    expect(payload.date).toBe("2024-01-15");
  });

  it("patches purchase amount slice when purchase amount sub-filter is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount];
    value.purchaseAmount = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: 75,
      secondValue: null,
    };

    const payload = buildDirtyPatchPayload(
      { purchaseAmount: { firstValue: true } },
      value,
    );

    expect(payload.value_payment_active).toBe(true);
    expect(payload.comparator_payment).toBe(SmartlistPaymentComparator.GTE);
    expect(payload.value_payment).toBe(75);
  });

  it("patches purchase amount slice when subFilters array is dirty", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount];
    value.purchaseAmount = {
      operator: NUMERIC_COMPARATOR_OPERATORS.equal,
      firstValue: 100,
      secondValue: null,
    };

    const payload = buildDirtyPatchPayload({ subFilters: [true] }, value);

    expect(payload.value_payment_active).toBe(true);
    expect(payload.comparator_payment).toBe(SmartlistPaymentComparator.EQUAL);
    expect(payload.value_payment).toBe(100);
  });
});
