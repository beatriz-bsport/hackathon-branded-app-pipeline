import { describe, expect, it } from "vitest";

import type { LiabilityWaiverFilter } from "@bsport/api-cdp/smartlist";

import { mapLiabilityWaiverFilterToFormValue } from "#src/components/filters/liability-waiver-filter/mappers/api-to-form-value";

const LIABILITY_WAIVER_FILTER_IDENTIFIER = 410;

const buildApiFilter = (
  overrides: Partial<LiabilityWaiverFilter> = {},
): LiabilityWaiverFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: LIABILITY_WAIVER_FILTER_IDENTIFIER,
  value: true,
  ...overrides,
});

describe("mapLiabilityWaiverFilterToFormValue", () => {
  it("maps true API value to accepted form option", () => {
    const filter = buildApiFilter({ value: true });

    const formValue = mapLiabilityWaiverFilterToFormValue(filter);

    expect(formValue.value).toBe(true);
  });

  it("maps false API value to not accepted form option", () => {
    const filter = buildApiFilter({ value: false });

    const formValue = mapLiabilityWaiverFilterToFormValue(filter);

    expect(formValue.value).toBe(false);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapLiabilityWaiverFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
