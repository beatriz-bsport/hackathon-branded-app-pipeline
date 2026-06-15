import { describe, expect, it, vi } from "vitest";

import {
  BOOKING_MILESTONE_FILTER_IDENTIFIER,
  type BookingMilestoneFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { mapBookingMilestoneFilterToFormValue } from "#src/components/filters/booking-milestone/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildApiFilter = (
  overrides: Partial<BookingMilestoneFilter> = {},
): BookingMilestoneFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: Number(BOOKING_MILESTONE_FILTER_IDENTIFIER),
  value: 1,
  is_v2: true,
  select_all_activities: true,
  activity_filter_active: false,
  meta_activities: [],
  select_all_establishments: true,
  establishment_filter_active: false,
  establishments: [],
  select_all_payment_packs: true,
  payment_pack_filter_active: false,
  payment_packs: [],
  select_all_coaches: true,
  coach_filter_active: false,
  coaches: [],
  level_filter_active: false,
  level: [],
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: null,
  date_second: null,
  duration: null,
  duration_second: null,
  hour_filter_active: null,
  hour: null,
  hour_second: null,
  attendance_filter_active: null,
  attendance: null,
  ...overrides,
});

describe("mapBookingMilestoneFilterToFormValue", () => {
  it("preserves id, smartlist and milestone value", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7, value: 3 });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
    expect(formValue.value).toBe(3);
  });

  it("preserves API value (including 0) — schema enforces the >= 1 bound", () => {
    const filter = buildApiFilter({ value: 0 });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.value).toBe(0);
  });

  it("activates activity sub-filter when API activity filter is active", () => {
    const filter = buildApiFilter({
      activity_filter_active: true,
      select_all_activities: false,
      meta_activities: [10, 20],
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["activity"]);
    expect(formValue.activity.selectAllActivities).toBe(false);
    expect(formValue.activity.selectedMetaActivityIds).toEqual([10, 20]);
  });

  it("activates establishment sub-filter when API flag is on", () => {
    const filter = buildApiFilter({
      establishment_filter_active: true,
      select_all_establishments: false,
      establishments: [3, 4],
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["establishment"]);
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([3, 4]);
  });

  it("activates coach sub-filter when API flag is on", () => {
    const filter = buildApiFilter({
      coach_filter_active: true,
      select_all_coaches: false,
      coaches: [55, 66],
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["coach"]);
    expect(formValue.coach.selectedCoachIds).toEqual([55, 66]);
  });

  it("activates payment pack sub-filter when API flag is on", () => {
    const filter = buildApiFilter({
      payment_pack_filter_active: true,
      select_all_payment_packs: false,
      payment_packs: [12, 34],
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["paymentPack"]);
    expect(formValue.paymentPack.selectedPaymentPackIds).toEqual([12, 34]);
  });

  it("activates level sub-filter when API flag is on", () => {
    const filter = buildApiFilter({
      level_filter_active: true,
      level: [4, 8],
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["level"]);
    expect(formValue.level.selectedLevelIds).toEqual([4, 8]);
  });

  it("activates booking date sub-filter when API date filter is active", () => {
    const filter = buildApiFilter({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_BETWEEN,
      date: "2026-02-01",
      date_second: "2026-02-28",
      duration: 0,
      duration_second: 0,
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toContain("bookingDate");
    expect(formValue.bookingDate.absolute.fromDate).toBe("2026-02-01");
    expect(formValue.bookingDate.absolute.toDate).toBe("2026-02-28");
  });

  it("activates booking hour range sub-filter when API hour filter is active", () => {
    const filter = buildApiFilter({
      hour_filter_active: true,
      hour: "08:30",
      hour_second: "17:45",
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toContain("bookingHourRange");
    expect(formValue.bookingHourRange.hour).toBe("08:30");
    expect(formValue.bookingHourRange.hourSecond).toBe("17:45");
  });

  it("activates attendance mode sub-filter when API attendance filter is on", () => {
    const filter = buildApiFilter({
      attendance_filter_active: true,
      attendance: false,
    });

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toContain("attendanceMode");
    expect(formValue.attendanceMode.attendance).toBe(false);
  });

  it("returns no active sub-filters when API has every flag off", () => {
    const filter = buildApiFilter();

    const formValue = mapBookingMilestoneFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
  });
});
