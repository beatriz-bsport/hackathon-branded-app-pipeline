import { describe, expect, it } from "vitest";

import { mapTermsAndConditionsFilterToFormValue } from "#src/components/filters/terms-and-conditions-filter/mappers/api-to-form-value";

const TERMS_AND_CONDITIONS_FILTER_IDENTIFIER = 107;

const baseApiFilter = {
  id: 64,
  company: 7,
  smartlist: 123,
  value: true,
  filter_identifier: TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
};

describe("mapTermsAndConditionsFilterToFormValue", () => {
  it("maps server fields to the form value shape", () => {
    const formValue = mapTermsAndConditionsFilterToFormValue(baseApiFilter);

    expect(formValue).toEqual({
      id: 64,
      smartlist: 123,
      value: true,
    });
  });

  it("preserves not accepted when hydrated from the API", () => {
    const formValue = mapTermsAndConditionsFilterToFormValue({
      ...baseApiFilter,
      value: false,
    });

    expect(formValue.value).toBe(false);
  });
});
