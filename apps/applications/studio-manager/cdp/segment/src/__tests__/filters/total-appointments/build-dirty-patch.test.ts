import { describe, expect, it } from "vitest";

import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/total-appointments/mappers/build-dirty-patch";
import type { TotalAppointmentsNumberFilterFormValue } from "#src/components/filters/total-appointments/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TotalAppointmentsNumberFilterFormValue>>
>;

describe("buildDirtyPatchPayload (total appointments)", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator/value fields when comparator section is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.equal;
    value.value = 4;
    const dirtyFields: DirtyFields = { type: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.comparator).toBe(5);
    expect(payload.value).toBe(4);
    expect(payload.value_second).toBe(0);
  });

  it("emits between value_second when between comparator is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.value = 1;
    value.secondValue = 6;
    const dirtyFields: DirtyFields = {
      secondValue: true,
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.comparator).toBe(6);
    expect(payload.value).toBe(1);
    expect(payload.value_second).toBe(6);
  });
});
