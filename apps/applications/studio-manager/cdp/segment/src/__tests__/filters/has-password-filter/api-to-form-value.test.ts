import { describe, expect, it } from "vitest";

import type { HasPasswordFilter } from "@bsport/api-cdp/smartlist";

import { mapHasPasswordFilterToFormValue } from "#src/components/filters/has-password-filter/mappers/api-to-form-value";

const HAS_PASSWORD_FILTER_IDENTIFIER = 400;

const buildApiFilter = (
  overrides: Partial<HasPasswordFilter> = {},
): HasPasswordFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: HAS_PASSWORD_FILTER_IDENTIFIER,
  value: true,
  ...overrides,
});

describe("mapHasPasswordFilterToFormValue", () => {
  it("maps true API value to has set form option", () => {
    const filter = buildApiFilter({ value: true });

    const formValue = mapHasPasswordFilterToFormValue(filter);

    expect(formValue.value).toBe(true);
  });

  it("maps false API value to has not set form option", () => {
    const filter = buildApiFilter({ value: false });

    const formValue = mapHasPasswordFilterToFormValue(filter);

    expect(formValue.value).toBe(false);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapHasPasswordFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
