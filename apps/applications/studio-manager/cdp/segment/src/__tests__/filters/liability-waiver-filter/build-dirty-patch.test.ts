import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultLiabilityWaiverFilter } from "#src/components/filters/liability-waiver-filter/default-value";
import { buildLiabilityWaiverFilterDirtyPatch } from "#src/components/filters/liability-waiver-filter/mappers/build-dirty-patch";
import type { LiabilityWaiverFilterFormValue } from "#src/components/filters/liability-waiver-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<LiabilityWaiverFilterFormValue>>
>;

describe("buildLiabilityWaiverFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultLiabilityWaiverFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildLiabilityWaiverFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the waiver field is dirty", () => {
    const value = createDefaultLiabilityWaiverFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildLiabilityWaiverFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({ value: false });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultLiabilityWaiverFilter(1);
    value.value = false;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildLiabilityWaiverFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
