import { describe, expect, it } from "vitest";

import {
  type PrivateBookingsFilter,
  SmartlistDateFilterType,
  SmartlistPrivateBookingsComparator,
} from "@bsport/api-cdp/smartlist";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { mapTotalAppointmentsFilterToFormValue } from "#src/components/filters/total-appointments/mappers/api-to-form-value";

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
});
