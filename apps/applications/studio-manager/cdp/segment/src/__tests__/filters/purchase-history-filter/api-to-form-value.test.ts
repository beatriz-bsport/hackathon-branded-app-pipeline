import { describe, expect, it } from "vitest";

import {
  EXPENSES_COMPLETE_BUYABLE,
  EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  type ExpensesCompleteFilter,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { mapPurchaseHistoryFilterToFormValue } from "#src/components/filters/purchase-history-filter/mappers/api-to-form-value";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "#src/components/filters/purchase-history-filter/sub-filters/purchase-history-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

const baseApiFilter: ExpensesCompleteFilter = {
  id: 10,
  smartlist: 5,
  company_id: 1,
  filter_identifier: Number(EXPENSES_COMPLETE_FILTER_IDENTIFIER),
  buyable_identifiers: [],
  comparator: SmartlistCreditComparator.GTE,
  value: 100,
  value_second: 50,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: "2024-01-01",
  date_second: "2024-12-31",
  duration: 0,
  duration_second: 0,
};

describe("mapPurchaseHistoryFilterToFormValue", () => {
  it("maps empty buyable_identifiers from fetch as all product types", () => {
    const formValue = mapPurchaseHistoryFilterToFormValue(baseApiFilter);

    expect(formValue.spentOn).toEqual([
      ...EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER,
    ]);
  });

  it("maps subset buyable_identifiers from fetch", () => {
    const formValue = mapPurchaseHistoryFilterToFormValue({
      ...baseApiFilter,
      buyable_identifiers: [
        EXPENSES_COMPLETE_BUYABLE.PRIVATE_PASS,
        EXPENSES_COMPLETE_BUYABLE.WORKSHOP,
      ],
    });

    expect(formValue.spentOn).toEqual([9, 50]);
  });

  it("maps total spent comparator and value from fetch", () => {
    const formValue = mapPurchaseHistoryFilterToFormValue({
      ...baseApiFilter,
      comparator: SmartlistCreditComparator.BETWEEN,
      value: 20,
      value_second: 80,
    });

    expect(formValue.totalSpent.operator).toBe(
      NUMERIC_COMPARATOR_OPERATORS.between,
    );
    expect(formValue.totalSpent.firstValue).toBe(20);
    expect(formValue.totalSpent.secondValue).toBe(80);
  });

  it("activates purchase date sub-filter when date_filter_active is true", () => {
    const formValue = mapPurchaseHistoryFilterToFormValue({
      ...baseApiFilter,
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-15",
      date_second: "2024-06-15",
    });

    expect(formValue.subFilters).toContain(
      PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate,
    );
    expect(formValue.purchaseDate.absolute.fromDate).toBe("2024-06-15");
  });
});
