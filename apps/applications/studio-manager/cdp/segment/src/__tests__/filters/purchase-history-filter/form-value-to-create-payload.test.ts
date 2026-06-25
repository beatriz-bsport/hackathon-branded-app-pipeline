import { describe, expect, it } from "vitest";

import {
  EXPENSES_COMPLETE_BUYABLE,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { createDefaultPurchaseHistoryFilter } from "#src/components/filters/purchase-history-filter/default-value";
import { createPurchaseHistoryFilterPayload } from "#src/components/filters/purchase-history-filter/mappers/form-value-to-create-payload";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "#src/components/filters/purchase-history-filter/sub-filters/purchase-history-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { getDefaultApiDate } from "#src/components/primitive-filters/date-filter/utils";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("createPurchaseHistoryFilterPayload", () => {
  it("creates payload with all product ids when every type is selected", () => {
    const value = createDefaultPurchaseHistoryFilter(123);

    const payload = createPurchaseHistoryFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      buyable_identifiers: [1, 2, 9, 10, 50],
      comparator: SmartlistCreditComparator.GTE,
      value: 1,
      value_second: 50,
      date_filter_active: false,
      date: getDefaultApiDate(),
      date_second: getDefaultApiDate(),
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      duration: 0,
      duration_second: 0,
    });
  });

  it("sends subset buyable_identifiers when not all types are selected", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.spentOn = [
      EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK,
      EXPENSES_COMPLETE_BUYABLE.SHOP_ITEM,
    ];

    const payload = createPurchaseHistoryFilterPayload(value);

    expect(payload.buyable_identifiers).toEqual([1, 2]);
  });

  it("activates date filter when purchase date sub-filter is selected", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.subFilters = [PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-03-01",
        toDate: "2024-03-31",
      },
      relative: value.purchaseDate.relative,
    };

    const payload = createPurchaseHistoryFilterPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_BETWEEN);
    expect(payload.date).toBe("2024-03-01");
    expect(payload.date_second).toBe("2024-03-31");
  });

  it("maps between comparator with second value", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.totalSpent = {
      operator: NUMERIC_COMPARATOR_OPERATORS.between,
      firstValue: 50,
      secondValue: 200,
    };

    const payload = createPurchaseHistoryFilterPayload(value);

    expect(payload.comparator).toBe(SmartlistCreditComparator.BETWEEN);
    expect(payload.value).toBe(50);
    expect(payload.value_second).toBe(200);
  });
});
