import { describe, expect, it } from "vitest";

import { createDefaultTermsAndConditionsFilter } from "#src/components/filters/terms-and-conditions-filter/default-value";
import { createTermsAndConditionsFilterPayload } from "#src/components/filters/terms-and-conditions-filter/mappers/form-value-to-create-payload";

describe("createTermsAndConditionsFilterPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultTermsAndConditionsFilter(123);

    const payload = createTermsAndConditionsFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("defaults to accepted when creating a new filter", () => {
    const formValue = createDefaultTermsAndConditionsFilter(1);

    const payload = createTermsAndConditionsFilterPayload(formValue);

    expect(payload.value).toBe(true);
  });

  it("forwards the selected not accepted value", () => {
    const formValue = createDefaultTermsAndConditionsFilter(1);
    formValue.value = false;

    const payload = createTermsAndConditionsFilterPayload(formValue);

    expect(payload.value).toBe(false);
  });
});
