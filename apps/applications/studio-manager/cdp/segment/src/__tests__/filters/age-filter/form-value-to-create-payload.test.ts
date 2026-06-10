import { describe, expect, it } from "vitest";

import { AgeFilterComparator } from "@bsport/api-cdp/smartlist";

import { AGE_FILTER_NUMBER_TYPE } from "#src/components/filters/age-filter/constants";
import { createDefaultAgeFilter } from "#src/components/filters/age-filter/default-value";
import { toCreatePayload } from "#src/components/filters/age-filter/mappers/form-value-to-create-payload";

describe("toCreatePayload", () => {
  it("maps greater or equal with value_second 0", () => {
    const value = createDefaultAgeFilter(123);
    value.value = 18;

    expect(toCreatePayload(value)).toEqual({
      smartlist: 123,
      comparator: AgeFilterComparator.GTE,
      value: 18,
      value_second: 0,
    });
  });

  it("maps between comparator with both bounds", () => {
    const value = createDefaultAgeFilter(123);
    value.type = AGE_FILTER_NUMBER_TYPE.between;
    value.value = 18;
    value.secondValue = 25;

    expect(toCreatePayload(value)).toEqual({
      smartlist: 123,
      comparator: AgeFilterComparator.BETWEEN,
      value: 18,
      value_second: 25,
    });
  });
});
