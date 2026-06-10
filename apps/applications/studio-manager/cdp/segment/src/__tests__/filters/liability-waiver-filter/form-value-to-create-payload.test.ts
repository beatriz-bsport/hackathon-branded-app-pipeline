import { describe, expect, it } from "vitest";

import { createDefaultLiabilityWaiverFilter } from "#src/components/filters/liability-waiver-filter/default-value";
import { createLiabilityWaiverFilterPayload } from "#src/components/filters/liability-waiver-filter/mappers/form-value-to-create-payload";

describe("createLiabilityWaiverFilterPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultLiabilityWaiverFilter(123);

    const payload = createLiabilityWaiverFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("defaults to accepted when creating a new filter", () => {
    const formValue = createDefaultLiabilityWaiverFilter(1);

    const payload = createLiabilityWaiverFilterPayload(formValue);

    expect(payload.value).toBe(true);
  });

  it("forwards the selected not accepted value", () => {
    const formValue = createDefaultLiabilityWaiverFilter(1);
    formValue.value = false;

    const payload = createLiabilityWaiverFilterPayload(formValue);

    expect(payload.value).toBe(false);
  });
});
