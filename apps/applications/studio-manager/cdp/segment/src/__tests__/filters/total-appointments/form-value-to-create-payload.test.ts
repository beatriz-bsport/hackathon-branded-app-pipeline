import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPrivateBookingsComparator,
} from "@bsport/api-cdp/smartlist";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { createTotalAppointmentsPayload } from "#src/components/filters/total-appointments/mappers/form-value-to-create-payload";

describe("createTotalAppointmentsPayload", () => {
  it("uses the smartlist id from form value", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(123);

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.smartlist).toBe(123);
  });

  it("maps comparator and values for non-between types", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual;
    value.value = 6;
    value.secondValue = null;

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.comparator).toBe(SmartlistPrivateBookingsComparator.GTE);
    expect(payload.value).toBe(6);
    expect(payload.value_second).toBe(0);
  });

  it("maps value_second for between comparator", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.value = 2;
    value.secondValue = 8;

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.comparator).toBe(SmartlistPrivateBookingsComparator.BETWEEN);
    expect(payload.value).toBe(2);
    expect(payload.value_second).toBe(8);
  });

  it("keeps all scope sections inactive on create", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.establishment_filter_active).toBe(false);
    expect(payload.private_service_filter_active).toBe(false);
    expect(payload.private_pass_filter_active).toBe(false);
    expect(payload.coach_filter_active).toBe(false);
    expect(payload.date_filter_active).toBe(false);
    expect(payload.hour_filter_active).toBe(false);
    expect(payload.establishments).toEqual([]);
    expect(payload.private_services).toEqual([]);
    expect(payload.private_passes).toEqual([]);
    expect(payload.coaches).toEqual([]);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_EXACT);
  });
});
