import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { createDefaultBasketAbandonmentFilter } from "#src/components/filters/basket-abandonment-filter/default-value";
import { createBasketAbandonmentFilterPayload } from "#src/components/filters/basket-abandonment-filter/mappers/form-value-to-create-payload";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "#src/components/filters/basket-abandonment-filter/sub-filters/basket-abandonment-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

describe("createBasketAbandonmentFilterPayload", () => {
  it("creates a minimal price-only payload by default", () => {
    const value = createDefaultBasketAbandonmentFilter(123);

    const payload = createBasketAbandonmentFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      comparator: SmartlistPaymentComparator.LTE,
      basket_value: 0,
      basket_value_second: 0,
      date_filter_active: false,
    });
  });

  it("maps whole form amounts to API basket_value on create", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.basketValue.firstValue = 10;

    const payload = createBasketAbandonmentFilterPayload(value);

    expect(payload.basket_value).toBe(10);
  });

  it("activates date filter fields when abandonment date sub-filter is selected", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.subFilters = [BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate];
    value.abandonmentDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-03-01",
        toDate: "2024-03-31",
      },
      relative: value.abandonmentDate.relative,
    };

    const payload = createBasketAbandonmentFilterPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_BETWEEN);
    expect(payload.date).toBe("2024-03-01");
    expect(payload.date_second).toBe("2024-03-31");
  });

  it("maps BETWEEN comparator amounts to API fields", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.basketValue.operator = NUMERIC_COMPARATOR_OPERATORS.between;
    value.basketValue.firstValue = 10;
    value.basketValue.secondValue = 50;

    const payload = createBasketAbandonmentFilterPayload(value);

    expect(payload.comparator).toBe(SmartlistPaymentComparator.BETWEEN);
    expect(payload.basket_value).toBe(10);
    expect(payload.basket_value_second).toBe(50);
  });
});
