import { describe, expect, it } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistPrivateBookingsComparator,
} from "@bsport/api-cdp/smartlist";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { createTotalAppointmentsPayload } from "#src/components/filters/total-appointments/mappers/form-value-to-create-payload";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "#src/components/filters/total-appointments/sub-filters/total-appointments-sub-filter-id";

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
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_AFTER);
  });

  it("keeps date filter inactive when booking date sub-filter is not selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    value.bookingDate = {
      ...value.bookingDate,
      dateType: "absolute",
      absolute: {
        ...value.bookingDate.absolute,
        operator: "between",
        fromDate: "2026-01-01",
        toDate: "2026-01-31",
      },
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.date_filter_active).toBe(false);
  });

  it("activates date filter API fields when booking date sub-filter is selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate];
    value.bookingDate = {
      ...value.bookingDate,
      dateType: "absolute",
      absolute: {
        ...value.bookingDate.absolute,
        operator: "between",
        fromDate: "2026-03-01",
        toDate: "2026-03-15",
      },
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2026-03-01");
    expect(payload.date_second).toBe("2026-03-15");
  });

  it("keeps hour filter inactive when booking hour range sub-filter is not selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    value.bookingHourRange = {
      hour: "10:00",
      hourSecond: "11:00",
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.hour_filter_active).toBe(false);
    expect(payload.hour).toBeNull();
    expect(payload.hour_second).toBeNull();
  });

  it("activates hour filter API fields when booking hour range sub-filter is selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange];
    value.bookingHourRange = {
      hour: "07:15",
      hourSecond: "21:30",
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.hour_filter_active).toBe(true);
    expect(payload.hour).toBe("07:15");
    expect(payload.hour_second).toBe("21:30");
  });

  it("normalizes empty hour fields when booking hour range sub-filter is selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange];
    value.bookingHourRange = {
      hour: "",
      hourSecond: "",
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.hour_filter_active).toBe(true);
    expect(payload.hour).toBe("09:00");
    expect(payload.hour_second).toBe("18:00");
  });

  it("keeps coach fields inactive when coach sub-filter is not selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [1, 2],
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.coach_filter_active).toBe(false);
    expect(payload.select_all_coaches).toBe(true);
    expect(payload.coaches).toEqual([]);
  });

  it("activates coach fields when coach sub-filter is selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [3, 9],
    };

    const payload = createTotalAppointmentsPayload(value);

    expect(payload.coach_filter_active).toBe(true);
    expect(payload.select_all_coaches).toBe(false);
    expect(payload.coaches).toEqual([3, 9]);
  });
});
