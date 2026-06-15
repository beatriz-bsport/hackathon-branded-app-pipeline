import { describe, expect, it } from "vitest";

import { createDefaultHasPasswordFilter } from "#src/components/filters/has-password-filter/default-value";
import { createHasPasswordFilterPayload } from "#src/components/filters/has-password-filter/mappers/form-value-to-create-payload";

describe("createHasPasswordFilterPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultHasPasswordFilter(123);

    const payload = createHasPasswordFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("defaults to has set when creating a new filter", () => {
    const formValue = createDefaultHasPasswordFilter(1);

    const payload = createHasPasswordFilterPayload(formValue);

    expect(payload.value).toBe(true);
  });

  it("forwards the selected has not set value", () => {
    const formValue = createDefaultHasPasswordFilter(1);
    formValue.value = false;

    const payload = createHasPasswordFilterPayload(formValue);

    expect(payload.value).toBe(false);
  });
});
