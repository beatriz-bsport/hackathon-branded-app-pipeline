import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultLastBookingFilter } from "#src/components/filters/last-booking-filter/default-value";
import { buildLastBookingFilterDirtyPatch } from "#src/components/filters/last-booking-filter/mappers/build-dirty-patch";
import type { LastBookingFilterFormValue } from "#src/components/filters/last-booking-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<LastBookingFilterFormValue>>
>;

describe("buildLastBookingFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultLastBookingFilter(1);
    value.value = 30;
    const dirtyFields: DirtyFields = {};

    const payload = buildLastBookingFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `value` only when the days field is dirty", () => {
    const value = createDefaultLastBookingFilter(1);
    value.value = 45;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildLastBookingFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({ value: 45 });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultLastBookingFilter(1);
    value.value = 45;
    const dirtyFields: DirtyFields = { value: false };

    const payload = buildLastBookingFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
