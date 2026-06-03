import { describe, expect, it, vi } from "vitest";

import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { createDefaultBookingMilestoneFilter } from "#src/components/filters/booking-milestone/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/booking-milestone/mappers/build-dirty-patch";
import { BOOKING_MILESTONE_SUB_FILTER_IDS } from "#src/components/filters/booking-milestone/sub-filters/booking-milestone-sub-filter-id";
import type { BookingMilestoneFilterFormValue } from "#src/components/filters/booking-milestone/types";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<BookingMilestoneFilterFormValue>>
>;

describe("buildDirtyPatchPayload (booking milestone)", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits value when milestone value is dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.value = 5;
    const dirtyFields: DirtyFields = { value: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.value).toBe(5);
  });

  it("does not emit value when only sub-filters are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.activity];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [11],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [true],
      activity: { selectedMetaActivityIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.value).toBeUndefined();
  });

  it("emits active activity slice when activity sub-filter values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.activity];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [11],
    };
    const dirtyFields: DirtyFields = {
      activity: { selectedMetaActivityIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.activity_filter_active).toBe(true);
    expect(payload.select_all_activities).toBe(false);
    expect(payload.meta_activities).toEqual([11]);
  });

  it("emits inactive activity slice when activity sub-filter is removed", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [];
    value.activity = {
      selectAllActivities: true,
      selectedMetaActivityIds: [],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.activity_filter_active).toBe(false);
    expect(payload.meta_activities).toEqual([]);
  });

  it("emits active establishment slice when establishment values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [4],
    };
    const dirtyFields: DirtyFields = {
      establishment: { selectedEstablishmentIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.establishments).toEqual([4]);
  });

  it("emits active coach slice when coach values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.coach];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [9],
    };
    const dirtyFields: DirtyFields = {
      coach: { selectedCoachIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.coach_filter_active).toBe(true);
    expect(payload.coaches).toEqual([9]);
  });

  it("emits active payment pack slice when payment pack values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.paymentPack];
    value.paymentPack = {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [44],
    };
    const dirtyFields: DirtyFields = {
      paymentPack: { selectedPaymentPackIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.payment_pack_filter_active).toBe(true);
    expect(payload.payment_packs).toEqual([44]);
  });

  it("emits active level slice when level values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.level];
    value.level = {
      selectedLevelIds: [77],
    };
    const dirtyFields: DirtyFields = {
      level: { selectedLevelIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.level_filter_active).toBe(true);
    expect(payload.level).toEqual([77]);
  });

  it("emits active booking date slice when booking date values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingDate];
    value.bookingDate = {
      ...value.bookingDate,
      dateType: "absolute",
      absolute: {
        ...value.bookingDate.absolute,
        operator: "on_or_after",
        fromDate: "2026-08-01",
        toDate: null,
      },
    };
    const dirtyFields: DirtyFields = {
      bookingDate: { absolute: { fromDate: true } },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2026-08-01");
  });

  it("emits active booking hour range slice when hour values are dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingHourRange];
    value.bookingHourRange = {
      hour: "10:00",
      hourSecond: "12:00",
    };
    const dirtyFields: DirtyFields = {
      bookingHourRange: { hour: true },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.hour_filter_active).toBe(true);
    expect(payload.hour).toBe("10:00");
    expect(payload.hour_second).toBe("12:00");
  });

  it("emits active attendance slice when attendance mode is dirty", () => {
    const value = createDefaultBookingMilestoneFilter(1);
    value.subFilters = [BOOKING_MILESTONE_SUB_FILTER_IDS.attendanceMode];
    value.attendanceMode = { attendance: false };
    const dirtyFields: DirtyFields = {
      attendanceMode: { attendance: true },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.attendance_filter_active).toBe(true);
    expect(payload.attendance).toBe(false);
  });
});
