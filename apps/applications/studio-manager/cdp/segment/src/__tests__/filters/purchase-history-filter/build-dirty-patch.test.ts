import { describe, expect, it } from "vitest";

import {
  EXPENSES_COMPLETE_BUYABLE,
  SmartlistCreditComparator,
} from "@bsport/api-cdp/smartlist";

import { createDefaultPurchaseHistoryFilter } from "#src/components/filters/purchase-history-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/purchase-history-filter/mappers/build-dirty-patch";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "#src/components/filters/purchase-history-filter/sub-filters/purchase-history-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("buildDirtyPatchPayload", () => {
  it("returns empty patch when nothing is dirty", () => {
    const value = createDefaultPurchaseHistoryFilter(1);

    const payload = buildDirtyPatchPayload({}, value);

    expect(payload).toEqual({});
  });

  it("includes comparator fields when totalSpent is dirty", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.totalSpent = {
      operator: NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      firstValue: 25,
      secondValue: null,
    };

    const payload = buildDirtyPatchPayload(
      { totalSpent: { firstValue: true, operator: true } },
      value,
    );

    expect(payload).toMatchObject({
      comparator: SmartlistCreditComparator.LTE,
      value: 25,
      value_second: 50,
    });
  });

  it("includes buyable_identifiers when spentOn is dirty", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.spentOn = [EXPENSES_COMPLETE_BUYABLE.SHOP_ITEM];

    const payload = buildDirtyPatchPayload({ spentOn: [true] }, value);

    expect(payload.buyable_identifiers).toEqual([2]);
  });

  it("includes date slice when purchase date sub-filter is dirty", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.subFilters = [PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-05-01",
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const payload = buildDirtyPatchPayload(
      { subFilters: [true], purchaseDate: { absolute: { fromDate: true } } },
      value,
    );

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2024-05-01");
  });
});
