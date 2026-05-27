import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { createFirstPurchaseFilterPayload } from "#src/components/filters/first-purchase-filter/mappers/form-value-to-create-payload";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "#src/components/filters/first-purchase-filter/sub-filters/first-purchase-sub-filter-id";
import { getDefaultApiDate } from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

describe("createFirstPurchaseFilterPayload", () => {
  it("creates a minimal any-first-purchase payload by default", () => {
    const value = createDefaultFirstPurchaseFilter(123);

    const payload = createFirstPurchaseFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      first_payment_is_done: true,
      date_filter_active: false,
      date: getDefaultApiDate(),
      date_second: getDefaultApiDate(),
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
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
    expect(payload.date_filter_active).toBe(false);
    expect(payload.value_payment_active).toBe(false);
  });

  it("activates date filter fields when purchase date sub-filter is selected", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-03-01",
        toDate: "2024-03-31",
      },
      relative: value.purchaseDate.relative,
    };

    const payload = createFirstPurchaseFilterPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_BETWEEN);
    expect(payload.date).toBe("2024-03-01");
    expect(payload.date_second).toBe("2024-03-31");
  });

  it("does not activate date filter when status is notDone", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.firstPurchaseStatus = FIRST_PURCHASE_STATUS.notDone;
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-03-01",
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const payload = createFirstPurchaseFilterPayload(value);

    expect(payload.first_payment_is_done).toBe(false);
    expect(payload.date_filter_active).toBe(false);
  });
});
