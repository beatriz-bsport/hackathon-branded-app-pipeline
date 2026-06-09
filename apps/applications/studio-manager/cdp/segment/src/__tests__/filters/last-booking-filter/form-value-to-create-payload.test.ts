import { describe, expect, it } from "vitest";

import { createDefaultLastBookingFilter } from "#src/components/filters/last-booking-filter/default-value";
import { createLastBookingFilterPayload } from "#src/components/filters/last-booking-filter/mappers/form-value-to-create-payload";

describe("createLastBookingFilterPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultLastBookingFilter(123);
    formValue.value = 30;

    const payload = createLastBookingFilterPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("forwards the entered days value", () => {
    const formValue = createDefaultLastBookingFilter(1);
    formValue.value = 60;

    const payload = createLastBookingFilterPayload(formValue);

    expect(payload.value).toBe(60);
  });

  it("throws when value is missing on create", () => {
    const formValue = createDefaultLastBookingFilter(1);

    expect(() => createLastBookingFilterPayload(formValue)).toThrow(
      "Cannot create last booking filter without a value.",
    );
  });
});
