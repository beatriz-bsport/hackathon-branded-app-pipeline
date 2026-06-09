import { describe, expect, it } from "vitest";

import { createDefaultHasPhoneFilter } from "#src/components/filters/has-phone-filter/default-value";
import { createHasPhoneFilterPayload } from "#src/components/filters/has-phone-filter/mappers/form-value-to-create-payload";

describe("createHasPhoneFilterPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultHasPhoneFilter(123);

    const payload = createHasPhoneFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("defaults to has phone when creating a new filter", () => {
    const formValue = createDefaultHasPhoneFilter(1);

    const payload = createHasPhoneFilterPayload(formValue);

    expect(payload.value).toBe(true);
  });

  it("forwards the selected does not have phone value", () => {
    const formValue = createDefaultHasPhoneFilter(1);
    formValue.value = false;

    const payload = createHasPhoneFilterPayload(formValue);

    expect(payload.value).toBe(false);
  });
});
