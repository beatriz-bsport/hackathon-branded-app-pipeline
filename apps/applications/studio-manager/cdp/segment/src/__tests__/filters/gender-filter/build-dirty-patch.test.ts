import { describe, expect, it } from "vitest";

import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { GENDER_OPTIONS } from "#src/components/filters/gender-filter/constants";
import { createDefaultGenderFilter } from "#src/components/filters/gender-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/gender-filter/mappers/build-dirty-patch";
import type { GenderFilterFormValue } from "#src/components/filters/gender-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<GenderFilterFormValue>>
>;

describe("buildDirtyPatchPayload", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultGenderFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the gender field is dirty", () => {
    const value = createDefaultGenderFilter(1);
    value.value = GENDER_OPTIONS.female;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ value: "F" });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultGenderFilter(1);
    value.value = GENDER_OPTIONS.female;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
