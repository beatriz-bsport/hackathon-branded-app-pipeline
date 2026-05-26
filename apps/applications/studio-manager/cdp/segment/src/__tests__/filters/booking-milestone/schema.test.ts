import { describe, expect, it, vi } from "vitest";

import { createDefaultBookingMilestoneFilter } from "#src/components/filters/booking-milestone/default-value";
import { bookingMilestoneFilterSchema } from "#src/components/filters/booking-milestone/schema";
import { BOOKING_MILESTONE_SUB_FILTER_IDS } from "#src/components/filters/booking-milestone/sub-filters/booking-milestone-sub-filter-id";
import type { BookingMilestoneFilterFormValue } from "#src/components/filters/booking-milestone/types";
import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildFormValue = (
  overrides: Partial<BookingMilestoneFilterFormValue> = {},
): BookingMilestoneFilterFormValue => ({
  ...createDefaultBookingMilestoneFilter(1),
  ...overrides,
});

describe("bookingMilestoneFilterSchema", () => {
  it("rejects a non-positive smartlist id", () => {
    const value = buildFormValue({ smartlist: 0 });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects milestone value below 1", () => {
    const value = buildFormValue({ value: 0 });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["value"]);
    }
  });

  it("rejects non-integer milestone value", () => {
    const value = buildFormValue({ value: 1.5 });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts milestone value of 1", () => {
    const value = buildFormValue({ value: 1 });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts large milestone values", () => {
    const value = buildFormValue({ value: 25 });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects activity sub-filter when active and no activity is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.activity],
      activity: {
        selectAllActivities: false,
        selectedMetaActivityIds: [],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual([
        "activity",
        "selectedMetaActivityIds",
      ]);
    }
  });

  it("accepts activity sub-filter when at least one activity is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.activity],
      activity: {
        selectAllActivities: false,
        selectedMetaActivityIds: [12],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects establishment sub-filter when active and no establishment is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.establishment],
      establishment: {
        selectAllEstablishments: false,
        selectedEstablishmentIds: [],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects coach sub-filter when active and no coach is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.coach],
      coach: {
        selectAllCoaches: false,
        selectedCoachIds: [],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects payment pack sub-filter when active and no pass is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.paymentPack],
      paymentPack: {
        selectAllPaymentPacks: false,
        selectedPaymentPackIds: [],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects level sub-filter when active and no level is selected", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.level],
      level: {
        selectedLevelIds: [],
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects booking date sub-filter when absolute from date is missing", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingDate],
      bookingDate: {
        ...defaultDateFilterValue,
        dateType: "absolute",
        absolute: {
          ...defaultDateFilterValue.absolute,
          operator: "on_or_after",
          fromDate: null,
          toDate: null,
        },
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts booking date sub-filter with absolute on-or-after date", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingDate],
      bookingDate: {
        ...defaultDateFilterValue,
        dateType: "absolute",
        absolute: {
          ...defaultDateFilterValue.absolute,
          operator: "on_or_after",
          fromDate: "2026-06-10",
          toDate: null,
        },
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects booking hour range sub-filter when start time is after end time", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "18:00",
        hourSecond: "09:00",
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts booking hour range sub-filter when times are ordered", () => {
    const value = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "09:00",
        hourSecond: "18:00",
      },
    });

    const result = bookingMilestoneFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts attendance mode sub-filter for present and absent", () => {
    const presentValue = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.attendanceMode],
      attendanceMode: { attendance: true },
    });
    const absentValue = buildFormValue({
      subFilters: [BOOKING_MILESTONE_SUB_FILTER_IDS.attendanceMode],
      attendanceMode: { attendance: false },
    });

    expect(bookingMilestoneFilterSchema.safeParse(presentValue).success).toBe(
      true,
    );
    expect(bookingMilestoneFilterSchema.safeParse(absentValue).success).toBe(
      true,
    );
  });
});
