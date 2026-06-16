import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultHasPasswordFilter } from "#src/components/filters/has-password-filter/default-value";
import { buildHasPasswordFilterDirtyPatch } from "#src/components/filters/has-password-filter/mappers/build-dirty-patch";
import type { HasPasswordFilterFormValue } from "#src/components/filters/has-password-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<HasPasswordFilterFormValue>>
>;

describe("buildHasPasswordFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultHasPasswordFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildHasPasswordFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the password field is dirty", () => {
    const value = createDefaultHasPasswordFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildHasPasswordFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({ value: false });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultHasPasswordFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildHasPasswordFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
