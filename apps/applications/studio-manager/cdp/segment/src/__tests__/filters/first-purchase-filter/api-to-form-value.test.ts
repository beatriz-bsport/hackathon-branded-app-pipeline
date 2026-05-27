import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { mapFirstPurchaseFilterToFormValue } from "#src/components/filters/first-purchase-filter/mappers/api-to-form-value";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "#src/components/filters/first-purchase-filter/sub-filters/first-purchase-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

const baseApiFilter = {
  id: 10,
  smartlist: 5,
  company_id: 1,
  filter_identifier: 28,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: "2024-01-01",
  date_second: "2024-12-31",
  duration: 0,
  duration_second: 0,
  value_payment_active: false,
  comparator_payment: SmartlistPaymentComparator.GTE,
  value_payment: 0,
  value_second_payment: 0,
};

describe("mapFirstPurchaseFilterToFormValue", () => {
  it("maps first_payment_is_done true to done status", () => {
    const formValue = mapFirstPurchaseFilterToFormValue({
      ...baseApiFilter,
      first_payment_is_done: true,
    });

    expect(formValue.id).toBe(10);
    expect(formValue.smartlist).toBe(5);
    expect(formValue.firstPurchaseStatus).toBe(FIRST_PURCHASE_STATUS.done);
    expect(formValue.subFilters).toEqual([]);
  });

  it("maps first_payment_is_done false to notDone status", () => {
    const formValue = mapFirstPurchaseFilterToFormValue({
      ...baseApiFilter,
      id: 11,
      first_payment_is_done: false,
    });

    expect(formValue.firstPurchaseStatus).toBe(FIRST_PURCHASE_STATUS.notDone);
  });

  it("hydrates active purchase date sub-filter from API", () => {
    const formValue = mapFirstPurchaseFilterToFormValue({
      ...baseApiFilter,
      first_payment_is_done: true,
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_BETWEEN,
      date: "2024-01-01",
      date_second: "2024-06-30",
    });

    expect(formValue.subFilters).toEqual([
      FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate,
    ]);
    expect(formValue.purchaseDate.dateType).toBe(DATE_FILTER_TYPES.absolute);
    expect(formValue.purchaseDate.absolute.operator).toBe(
      ABSOLUTE_DATE_OPERATORS.between,
    );
    expect(formValue.purchaseDate.absolute.fromDate).toBe("2024-01-01");
    expect(formValue.purchaseDate.absolute.toDate).toBe("2024-06-30");
  });
});

describe("createDefaultFirstPurchaseFilter", () => {
  it("defaults to done status with no sub-filters", () => {
    const value = createDefaultFirstPurchaseFilter(99);

    expect(value.smartlist).toBe(99);
    expect(value.firstPurchaseStatus).toBe(FIRST_PURCHASE_STATUS.done);
    expect(value.subFilters).toEqual([]);
  });
});
