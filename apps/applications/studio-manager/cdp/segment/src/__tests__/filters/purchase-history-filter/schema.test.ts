import { describe, expect, it, vi } from "vitest";

import { createDefaultPurchaseHistoryFilter } from "#src/components/filters/purchase-history-filter/default-value";
import { purchaseHistoryFilterSchema } from "#src/components/filters/purchase-history-filter/schema";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "#src/components/filters/purchase-history-filter/sub-filters/purchase-history-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("purchaseHistoryFilterSchema", () => {
  it("accepts default form value with all product types selected", () => {
    const value = createDefaultPurchaseHistoryFilter(1);

    expect(purchaseHistoryFilterSchema.safeParse(value).success).toBe(true);
  });

  it("rejects empty spentOn selection", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.spentOn = [];

    const result = purchaseHistoryFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects missing total spent value", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.totalSpent = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: null,
      secondValue: null,
    };

    const result = purchaseHistoryFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects active purchase date sub-filter without a date", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.subFilters = [PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const result = purchaseHistoryFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between total spent when upper bound is lower than lower bound", () => {
    const value = createDefaultPurchaseHistoryFilter(1);
    value.totalSpent = {
      operator: NUMERIC_COMPARATOR_OPERATORS.between,
      firstValue: 200,
      secondValue: 100,
    };

    const result = purchaseHistoryFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
