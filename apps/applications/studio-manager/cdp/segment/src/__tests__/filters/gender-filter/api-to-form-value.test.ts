import { describe, expect, it } from "vitest";

import type { GenderFilter } from "@bsport/api-cdp/smartlist";

import { GENDER_OPTIONS } from "#src/components/filters/gender-filter/constants";
import { mapGenderFilterToFormValue } from "#src/components/filters/gender-filter/mappers/api-to-form-value";

const GENDER_FILTER_IDENTIFIER = 5;

const buildApiFilter = (
  overrides: Partial<GenderFilter> = {},
): GenderFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: GENDER_FILTER_IDENTIFIER,
  value: GENDER_OPTIONS.male,
  ...overrides,
});

describe("mapGenderFilterToFormValue", () => {
  it("maps male API value to the male form option", () => {
    const filter = buildApiFilter({ value: "M" });

    const formValue = mapGenderFilterToFormValue(filter);

    expect(formValue.value).toBe(GENDER_OPTIONS.male);
  });

  it("maps female API value to the female form option", () => {
    const filter = buildApiFilter({ value: "F" });

    const formValue = mapGenderFilterToFormValue(filter);

    expect(formValue.value).toBe(GENDER_OPTIONS.female);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapGenderFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
