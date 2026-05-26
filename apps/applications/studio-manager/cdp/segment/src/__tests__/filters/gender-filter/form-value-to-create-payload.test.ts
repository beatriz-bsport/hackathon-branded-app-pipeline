import { describe, expect, it } from "vitest";

import { GENDER_OPTIONS } from "#src/components/filters/gender-filter/constants";
import { createDefaultGenderFilter } from "#src/components/filters/gender-filter/default-value";
import { createGenderFilterPayload } from "#src/components/filters/gender-filter/mappers/form-value-to-create-payload";

describe("toCreatePayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultGenderFilter(123);

    const payload = createGenderFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("defaults to male when creating a new gender filter", () => {
    const formValue = createDefaultGenderFilter(1);

    const payload = createGenderFilterPayload(formValue);

    expect(payload.value).toBe(GENDER_OPTIONS.male);
  });

  it("forwards the selected female value", () => {
    const formValue = createDefaultGenderFilter(1);
    formValue.value = GENDER_OPTIONS.female;

    const payload = createGenderFilterPayload(formValue);

    expect(payload.value).toBe(GENDER_OPTIONS.female);
  });
});
