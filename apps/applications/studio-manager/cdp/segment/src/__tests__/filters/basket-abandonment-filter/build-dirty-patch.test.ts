import { describe, expect, it } from "vitest";

import { SmartlistPaymentComparator } from "@bsport/api-cdp/smartlist";

import { createDefaultBasketAbandonmentFilter } from "#src/components/filters/basket-abandonment-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/basket-abandonment-filter/mappers/build-dirty-patch";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "#src/components/filters/basket-abandonment-filter/sub-filters/basket-abandonment-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

describe("buildDirtyPatchPayload", () => {
  it("returns an empty patch when nothing is dirty", () => {
    const value = createDefaultBasketAbandonmentFilter(1);

    const payload = buildDirtyPatchPayload({}, value);

    expect(payload).toEqual({});
  });

  it("emits basket value slice when basket value fields are dirty", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.basketValue.firstValue = 25;

    const payload = buildDirtyPatchPayload(
      { basketValue: { firstValue: true } },
      value,
    );

    expect(payload.comparator).toBe(SmartlistPaymentComparator.LTE);
    expect(payload.basket_value).toBe(25);
  });

  it("emits date slice when subFilters change to include abandonment date", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.subFilters = [BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate];
    value.abandonmentDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-01-15",
        toDate: "2024-01-15",
      },
      relative: value.abandonmentDate.relative,
    };

    const payload = buildDirtyPatchPayload({ subFilters: [true] }, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2024-01-15");
  });

  it("emits inactive abandonment date slice when abandonment date sub-filter is removed", () => {
    const value = createDefaultBasketAbandonmentFilter(1);
    value.subFilters = [];

    const payload = buildDirtyPatchPayload({ subFilters: [true] }, value);

    expect(payload.date_filter_active).toBe(false);
  });
});
