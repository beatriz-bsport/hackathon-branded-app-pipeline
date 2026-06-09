import { describe, expect, it } from "vitest";

import {
  type BasketAbandonmentFilter,
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { mapBasketAbandonmentFilterToFormValue } from "#src/components/filters/basket-abandonment-filter/mappers/api-to-form-value";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "#src/components/filters/basket-abandonment-filter/sub-filters/basket-abandonment-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

const baseFilter: BasketAbandonmentFilter = {
  id: 10,
  smartlist: 5,
  company_id: 2,
  filter_identifier: 20,
  comparator: SmartlistPaymentComparator.LTE,
  basket_value: 11,
  basket_value_second: 30,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: null,
  date_second: null,
  duration: 0,
  duration_second: 0,
};

describe("mapBasketAbandonmentFilterToFormValue", () => {
  it("maps API basket values to whole amounts in the form", () => {
    const formValue = mapBasketAbandonmentFilterToFormValue(baseFilter);

    expect(formValue.basketValue.operator).toBe(
      NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
    );
    expect(formValue.basketValue.firstValue).toBe(11);
    expect(formValue.subFilters).toEqual([]);
  });

  it("activates abandonment date sub-filter when date_filter_active is true", () => {
    const formValue = mapBasketAbandonmentFilterToFormValue({
      ...baseFilter,
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-01",
      date_second: "2024-06-01",
    });

    expect(formValue.subFilters).toEqual([
      BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate,
    ]);
  });
});
