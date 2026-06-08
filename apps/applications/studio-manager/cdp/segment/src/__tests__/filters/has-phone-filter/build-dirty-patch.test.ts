import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultHasPhoneFilter } from "#src/components/filters/has-phone-filter/default-value";
import { buildHasPhoneFilterDirtyPatch } from "#src/components/filters/has-phone-filter/mappers/build-dirty-patch";
import type { HasPhoneFilterFormValue } from "#src/components/filters/has-phone-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<HasPhoneFilterFormValue>>
>;

describe("buildHasPhoneFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultHasPhoneFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildHasPhoneFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the phone field is dirty", () => {
    const value = createDefaultHasPhoneFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildHasPhoneFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({ value: false });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultHasPhoneFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildHasPhoneFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
