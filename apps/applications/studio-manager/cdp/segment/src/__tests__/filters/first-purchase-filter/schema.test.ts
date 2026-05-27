import { describe, expect, it, vi } from "vitest";

import { FIRST_PURCHASE_STATUS } from "#src/components/filters/first-purchase-filter/constants";
import { createDefaultFirstPurchaseFilter } from "#src/components/filters/first-purchase-filter/default-value";
import { firstPurchaseFilterSchema } from "#src/components/filters/first-purchase-filter/schema";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "#src/components/filters/first-purchase-filter/sub-filters/first-purchase-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

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

  it("rejects active purchase date sub-filter without a date", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    const result = firstPurchaseFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("does not validate purchase date when status is notDone", () => {
    const value = createDefaultFirstPurchaseFilter(1);
    value.firstPurchaseStatus = FIRST_PURCHASE_STATUS.notDone;
    value.subFilters = [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: value.purchaseDate.relative,
    };

    expect(firstPurchaseFilterSchema.safeParse(value).success).toBe(true);
  });
});
