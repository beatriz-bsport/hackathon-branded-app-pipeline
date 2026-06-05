import { describe, expect, it } from "vitest";

import { createDefaultBasketAbandonmentFilter } from "#src/components/filters/basket-abandonment-filter/default-value";
import { basketAbandonmentFilterSchema } from "#src/components/filters/basket-abandonment-filter/schema";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "#src/components/filters/basket-abandonment-filter/sub-filters/basket-abandonment-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("basketAbandonmentFilterSchema", () => {
  it("accepts a default draft filter", () => {
    const value = createDefaultBasketAbandonmentFilter(1);

    const result = basketAbandonmentFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts BETWEEN comparator when abandonment date sub-filter is active", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.subFilters = [BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate];
    value.basketValue.operator = NUMERIC_COMPARATOR_OPERATORS.between;
    value.basketValue.firstValue = 10;
    value.basketValue.secondValue = 20;
    value.abandonmentDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-01-01",
        toDate: "2024-01-31",
      },
      relative: value.abandonmentDate.relative,
    };

    const result = basketAbandonmentFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("requires a second amount for BETWEEN", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.basketValue.operator = NUMERIC_COMPARATOR_OPERATORS.between;
    value.basketValue.secondValue = null;

    const result = basketAbandonmentFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
