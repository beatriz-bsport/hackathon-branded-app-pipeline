import { describe, expect, it, vi } from "vitest";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { totalAppointmentsNumberFilterSchema } from "#src/components/filters/total-appointments/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("totalAppointmentsNumberFilterSchema", () => {
  it("accepts a valid default form value", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("requires second value for between comparator", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.secondValue = null;

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between range when second value is lower than first", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.value = 5;
    value.secondValue = 2;

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
