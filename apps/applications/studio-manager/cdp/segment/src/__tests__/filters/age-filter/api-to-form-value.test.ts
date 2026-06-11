import { describe, expect, it } from "vitest";

import {
  AGE_FILTER_IDENTIFIER,
  AgeFilterComparator,
} from "@bsport/api-cdp/smartlist";

import { AGE_FILTER_NUMBER_TYPE } from "#src/components/filters/age-filter/constants";
import { mapAgeFilterToFormValue } from "#src/components/filters/age-filter/mappers/api-to-form-value";

describe("mapAgeFilterToFormValue", () => {
  it("maps between comparator with both bounds", () => {
    const formValue = mapAgeFilterToFormValue({
      id: 12,
      company: 7,
      smartlist: 123,
      comparator: AgeFilterComparator.BETWEEN,
      value: 18,
      value_second: 25,
      filter_identifier: Number(AGE_FILTER_IDENTIFIER),
    });

    expect(formValue).toEqual({
      id: 12,
      smartlist: 123,
      type: AGE_FILTER_NUMBER_TYPE.between,
      value: 18,
      secondValue: 25,
    });
  });

  it("clears second value for non-between comparators", () => {
    const formValue = mapAgeFilterToFormValue({
      id: 12,
      company: 7,
      smartlist: 123,
      comparator: AgeFilterComparator.GTE,
      value: 18,
      value_second: 0,
      filter_identifier: Number(AGE_FILTER_IDENTIFIER),
    });

    expect(formValue.secondValue).toBeNull();
    expect(formValue.type).toBe(AGE_FILTER_NUMBER_TYPE.greaterOrEqual);
  });
});
