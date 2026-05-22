import { describe, expect, it, vi } from "vitest";

import { createDefaultBookingMilestoneFilter } from "#src/components/filters/booking-milestone/default-value";
import { toCreatePayload } from "#src/components/filters/booking-milestone/mappers/form-value-to-create-payload";
import { BOOKING_MILESTONE_SUB_FILTER_IDS } from "#src/components/filters/booking-milestone/sub-filters/booking-milestone-sub-filter-id";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload (booking milestone)", () => {
  it("uses the smartlist id and value from form value", () => {
    const value = createDefaultBookingMilestoneFilter(123);
    value.value = 4;

    const payload = toCreatePayload(value);

    expect(payload.smartlist).toBe(123);
    expect(payload.value).toBe(4);
  });

  it("marks the filter as v2 by default", () => {
    const value = createDefaultBookingMilestoneFilter(1);

    const payload = toCreatePayload(value);

    expect(payload.is_v2).toBe(true);
  });

  it("activates activity fields when activity sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.activity];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [5, 7],
    };

    const payload = toCreatePayload(value);

    expect(payload.activity_filter_active).toBe(true);
    expect(payload.select_all_activities).toBe(false);
    expect(payload.meta_activities).toEqual([5, 7]);
  });

  it("keeps activity fields inactive when activity sub-filter is not selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [9],
    };

    const payload = toCreatePayload(value);

    expect(payload.activity_filter_active).toBe(false);
    expect(payload.select_all_activities).toBe(true);
    expect(payload.meta_activities).toEqual([]);
  });

  it("activates establishment fields when establishment sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [2, 8],
    };

    const payload = toCreatePayload(value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.establishments).toEqual([2, 8]);
  });

  it("activates coach fields when coach sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.coach];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [3, 9],
    };

    const payload = toCreatePayload(value);

    expect(payload.coach_filter_active).toBe(true);
    expect(payload.coaches).toEqual([3, 9]);
  });

  it("activates payment pack fields when payment pack sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.paymentPack];
    value.paymentPack = {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [1, 2],
    };

    const payload = toCreatePayload(value);

    expect(payload.payment_pack_filter_active).toBe(true);
    expect(payload.payment_packs).toEqual([1, 2]);
  });

  it("activates level fields when level sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.level];
    value.level = {
      selectedLevelIds: [5, 9],
    };

    const payload = toCreatePayload(value);

    expect(payload.level_filter_active).toBe(true);
    expect(payload.level).toEqual([5, 9]);
  });

  it("activates date filter API fields when booking date sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingDate];
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

    const payload = toCreatePayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2026-03-01");
    expect(payload.date_second).toBe("2026-03-15");
  });

  it("activates hour filter API fields when booking hour range sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingHourRange];
    value.bookingHourRange = {
      hour: "07:15",
      hourSecond: "21:30",
    };

    const payload = toCreatePayload(value);

    expect(payload.hour_filter_active).toBe(true);
    expect(payload.hour).toBe("07:15");
    expect(payload.hour_second).toBe("21:30");
  });

  it("keeps hour filter inactive when booking hour range sub-filter is not selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [];

    const payload = toCreatePayload(value);

    expect(payload.hour_filter_active).toBe(false);
    expect(payload.hour).toBeNull();
    expect(payload.hour_second).toBeNull();
  });

  it("activates attendance API fields when attendance sub-filter is selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.attendanceMode];
    value.attendanceMode = { attendance: false };

    const payload = toCreatePayload(value);

    expect(payload.attendance_filter_active).toBe(true);
    expect(payload.attendance).toBe(false);
  });

  it("keeps attendance inactive when attendance sub-filter is not selected", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [];
    value.attendanceMode = { attendance: false };

    const payload = toCreatePayload(value);

    expect(payload.attendance_filter_active).toBe(false);
    expect(payload.attendance).toBeNull();
  });
});
