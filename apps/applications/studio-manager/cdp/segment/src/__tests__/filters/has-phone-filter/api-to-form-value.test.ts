import { describe, expect, it } from "vitest";

import {
  HAS_PHONE_FILTER_IDENTIFIER,
  type HasPhoneFilter,
} from "@bsport/api-cdp/smartlist";

import { mapHasPhoneFilterToFormValue } from "#src/components/filters/has-phone-filter/mappers/api-to-form-value";

const buildApiFilter = (
  overrides: Partial<HasPhoneFilter> = {},
): HasPhoneFilter => ({
  id: 1,
  company: 1,
  smartlist: 1,
  filter_identifier: Number(HAS_PHONE_FILTER_IDENTIFIER),
  value: true,
  ...overrides,
});

describe("mapHasPhoneFilterToFormValue", () => {
  it("maps true API value to has phone form option", () => {
    const filter = buildApiFilter({ value: true });

    const formValue = mapHasPhoneFilterToFormValue(filter);

    expect(formValue.value).toBe(true);
  });

  it("maps false API value to does not have phone form option", () => {
    const filter = buildApiFilter({ value: false });

    const formValue = mapHasPhoneFilterToFormValue(filter);

    expect(formValue.value).toBe(false);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapHasPhoneFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
