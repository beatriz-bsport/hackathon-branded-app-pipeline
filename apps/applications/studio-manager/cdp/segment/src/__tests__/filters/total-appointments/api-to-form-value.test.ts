import { describe, expect, it } from "vitest";

import {
  type PrivateBookingsFilter,
  SmartlistDateFilterType,
  SmartlistPrivateBookingsComparator,
} from "@bsport/api-cdp/smartlist";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { mapTotalAppointmentsFilterToFormValue } from "#src/components/filters/total-appointments/mappers/api-to-form-value";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "#src/components/filters/total-appointments/sub-filters/total-appointments-sub-filter-id";

const PRIVATE_BOOKINGS_FILTER_IDENTIFIER = 26;

const buildApiFilter = (
  overrides: Partial<PrivateBookingsFilter> = {},
): PrivateBookingsFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  comparator: SmartlistPrivateBookingsComparator.GTE,
  value: 3,
  value_second: 0,
  select_all_establishments: false,
  establishment_filter_active: false,
  establishments: [],
  at_home: false,
  select_all_private_services: false,
  private_service_filter_active: false,
  private_services: [],
  select_all_private_passes: false,
  private_pass_filter_active: false,
  private_passes: [],
  select_all_coaches: false,
  coach_filter_active: false,
  coaches: [],
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: null,
  date_second: null,
  duration: null,
  duration_second: null,
  hour_filter_active: false,
  hour: null,
  hour_second: null,
  ...overrides,
});

describe("mapTotalAppointmentsFilterToFormValue", () => {
  it("preserves id and smartlist id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });

  it("maps comparator to local type", () => {
    const filter = buildApiFilter({
      comparator: SmartlistPrivateBookingsComparator.LTE,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.type).toBe(TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual);
  });

  it("maps second value only for between comparator", () => {
    const betweenFilter = buildApiFilter({
      comparator: SmartlistPrivateBookingsComparator.BETWEEN,
      value_second: 9,
    });
    const gteFilter = buildApiFilter({
      comparator: SmartlistPrivateBookingsComparator.GTE,
      value_second: 9,
    });

    const betweenFormValue =
      mapTotalAppointmentsFilterToFormValue(betweenFilter);
    const gteFormValue = mapTotalAppointmentsFilterToFormValue(gteFilter);

    expect(betweenFormValue.secondValue).toBe(9);
    expect(gteFormValue.secondValue).toBeNull();
  });

  it("maps value from API", () => {
    const filter = buildApiFilter({ value: 12 });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.value).toBe(12);
  });

  it("registers booking date sub-filter when the API slice is active", () => {
    const filter = buildApiFilter({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_BETWEEN,
      date: "2026-04-01",
      date_second: "2026-04-30",
      duration: 0,
      duration_second: 0,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate,
    );
    expect(formValue.bookingDate.absolute.fromDate).toBe("2026-04-01");
    expect(formValue.bookingDate.absolute.toDate).toBe("2026-04-30");
  });

  it("leaves booking date sub-filter out when the API slice is inactive", () => {
    const filter = buildApiFilter({
      date_filter_active: false,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate,
    );
  });

  it("activates booking hour range sub-filter when API hour filter is active", () => {
    const filter = buildApiFilter({
      hour_filter_active: true,
      hour: "08:30",
      hour_second: "17:45",
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    );
    expect(formValue.bookingHourRange.hour).toBe("08:30");
    expect(formValue.bookingHourRange.hourSecond).toBe("17:45");
  });

  it("normalizes empty API hour values to appointment hour range defaults", () => {
    const filter = buildApiFilter({
      hour_filter_active: true,
      hour: "",
      hour_second: "",
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    );
    expect(formValue.bookingHourRange.hour).toBe("09:00");
    expect(formValue.bookingHourRange.hourSecond).toBe("18:00");
  });

  it("does not list booking hour range sub-filter when API hour filter is inactive", () => {
    const filter = buildApiFilter({
      hour_filter_active: false,
      hour: "10:00",
      hour_second: "12:00",
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    );
  });

  it("activates coach sub-filter when API coach filter is active", () => {
    const filter = buildApiFilter({
      coach_filter_active: true,
      select_all_coaches: false,
      coaches: [55, 66],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach,
    );
    expect(formValue.coach.selectAllCoaches).toBe(false);
    expect(formValue.coach.selectedCoachIds).toEqual([55, 66]);
  });

  it("keeps coach sub-filter disabled defaults when API coach filter is inactive", () => {
    const filter = buildApiFilter({
      coach_filter_active: false,
      select_all_coaches: true,
      coaches: [],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach,
    );
    expect(formValue.coach.selectAllCoaches).toBe(true);
    expect(formValue.coach.selectedCoachIds).toEqual([]);
  });

  it("activates establishment sub-filter when API establishment filter is active", () => {
    const filter = buildApiFilter({
      establishment_filter_active: true,
      select_all_establishments: false,
      establishments: [3, 4],
      at_home: true,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment,
    );
    expect(formValue.establishment.selectAllEstablishments).toBe(false);
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([3, 4]);
    expect(formValue.establishment.atHome).toBe(true);
  });

  it("keeps establishment sub-filter disabled defaults when API establishment filter is inactive", () => {
    const filter = buildApiFilter({
      establishment_filter_active: false,
      select_all_establishments: true,
      establishments: [],
      at_home: false,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment,
    );
    expect(formValue.establishment.selectAllEstablishments).toBe(true);
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([]);
    expect(formValue.establishment.atHome).toBe(false);
  });

  it("hydrates establishment sub-filter with empty establishments when only at home is active", () => {
    const filter = buildApiFilter({
      establishment_filter_active: true,
      select_all_establishments: false,
      establishments: [],
      at_home: true,
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment,
    );
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([]);
    expect(formValue.establishment.atHome).toBe(true);
  });

  it("activates appointment pass sub-filter when API appointment pass filter is active", () => {
    const filter = buildApiFilter({
      private_pass_filter_active: true,
      select_all_private_passes: false,
      private_passes: [12, 34],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass,
    );
    expect(formValue.appointmentPass.selectAllAppointmentPasses).toBe(false);
    expect(formValue.appointmentPass.selectedAppointmentPassIds).toEqual([
      12, 34,
    ]);
  });

  it("keeps appointment pass sub-filter disabled defaults when API appointment pass filter is inactive", () => {
    const filter = buildApiFilter({
      private_pass_filter_active: false,
      select_all_private_passes: true,
      private_passes: [],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass,
    );
    expect(formValue.appointmentPass.selectAllAppointmentPasses).toBe(true);
    expect(formValue.appointmentPass.selectedAppointmentPassIds).toEqual([]);
  });

  it("activates private service sub-filter when API private service filter is active", () => {
    const filter = buildApiFilter({
      private_service_filter_active: true,
      select_all_private_services: false,
      private_services: [21, 22],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment,
    );
    expect(formValue.appointment.selectAllAppointments).toBe(false);
    expect(formValue.appointment.selectedAppointmentIds).toEqual([21, 22]);
  });

  it("keeps private service sub-filter disabled defaults when API private service filter is inactive", () => {
    const filter = buildApiFilter({
      private_service_filter_active: false,
      select_all_private_services: true,
      private_services: [],
    });

    const formValue = mapTotalAppointmentsFilterToFormValue(filter);

    expect(formValue.subFilters).not.toContain(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment,
    );
    expect(formValue.appointment.selectAllAppointments).toBe(true);
    expect(formValue.appointment.selectedAppointmentIds).toEqual([]);
  });
});
