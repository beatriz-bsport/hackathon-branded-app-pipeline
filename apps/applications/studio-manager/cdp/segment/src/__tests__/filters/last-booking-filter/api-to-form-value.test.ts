import { describe, expect, it } from "vitest";

import {
  LAST_BOOKING_FILTER_IDENTIFIER,
  type LastBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { mapLastBookingFilterToFormValue } from "#src/components/filters/last-booking-filter/mappers/api-to-form-value";

const buildApiFilter = (
  overrides: Partial<LastBookingFilter> = {},
): LastBookingFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: Number(LAST_BOOKING_FILTER_IDENTIFIER),
  value: 30,
  ...overrides,
});

describe("mapLastBookingFilterToFormValue", () => {
  it("maps the days value from the API payload", () => {
    const filter = buildApiFilter({ value: 45 });

    const formValue = mapLastBookingFilterToFormValue(filter);

    expect(formValue.value).toBe(45);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapLastBookingFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
