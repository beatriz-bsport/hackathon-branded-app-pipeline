import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultTermsAndConditionsFilter } from "#src/components/filters/terms-and-conditions-filter/default-value";
import { buildTermsAndConditionsFilterDirtyPatch } from "#src/components/filters/terms-and-conditions-filter/mappers/build-dirty-patch";
import type { TermsAndConditionsFilterFormValue } from "#src/components/filters/terms-and-conditions-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TermsAndConditionsFilterFormValue>>
>;

describe("buildTermsAndConditionsFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultTermsAndConditionsFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildTermsAndConditionsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the acceptance field is dirty", () => {
    const value = createDefaultTermsAndConditionsFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildTermsAndConditionsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({ value: false });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultTermsAndConditionsFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildTermsAndConditionsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
