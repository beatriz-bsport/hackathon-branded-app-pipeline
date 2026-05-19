import { describe, expect, it, vi } from "vitest";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { totalBookingNumberFilterSchema } from "#src/components/filters/total-booking/schema";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "#src/components/filters/total-booking/types";
import {
  DATE_FILTER_TYPE_RELATIVE,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildFormValue = (
  overrides: Partial<TotalBookingNumberFilterFormValue> = {},
): TotalBookingNumberFilterFormValue => ({
  ...createDefaultTotalBookingNumberFilter(1),
  ...overrides,
});

describe("totalBookingNumberFilterSchema", () => {
  it("rejects a non-positive smartlist id", () => {
    const value = buildFormValue({ smartlist: 0 });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between comparator when second value is missing", () => {
    const value = buildFormValue({
      type: TOTAL_BOOKING_NUMBER_TYPE.between,
      value: 3,
      secondValue: null,
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["secondValue"]);
    }
  });

  it("rejects between comparator when second value is lower than first", () => {
    const value = buildFormValue({
      type: TOTAL_BOOKING_NUMBER_TYPE.between,
      value: 5,
      secondValue: 3,
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts between comparator when bounds are valid", () => {
    const value = buildFormValue({
      type: TOTAL_BOOKING_NUMBER_TYPE.between,
      value: 2,
      secondValue: 5,
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects activity sub-filter when active and no activity is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.activity],
      activity: {
        selectAllActivities: false,
        selectedMetaActivityIds: [],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

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
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.activity],
      activity: {
        selectAllActivities: false,
        selectedMetaActivityIds: [12],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects establishment sub-filter when active and no establishment is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.establishment],
      establishment: {
        selectAllEstablishments: false,
        selectedEstablishmentIds: [],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual([
        "establishment",
        "selectedEstablishmentIds",
      ]);
    }
  });

  it("accepts establishment sub-filter when at least one establishment is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.establishment],
      establishment: {
        selectAllEstablishments: false,
        selectedEstablishmentIds: [7],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects coach sub-filter when active and no coach is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.coach],
      coach: {
        selectAllCoaches: false,
        selectedCoachIds: [],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["coach", "selectedCoachIds"]);
    }
  });

  it("accepts coach sub-filter when at least one coach is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.coach],
      coach: {
        selectAllCoaches: false,
        selectedCoachIds: [101, 102],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects payment pack sub-filter when active and no pass is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack],
      paymentPack: {
        selectAllPaymentPacks: false,
        selectedPaymentPackIds: [],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual([
        "paymentPack",
        "selectedPaymentPackIds",
      ]);
    }
  });

  it("accepts payment pack sub-filter when at least one pass is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack],
      paymentPack: {
        selectAllPaymentPacks: false,
        selectedPaymentPackIds: [501],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects level sub-filter when active and no level is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.level],
      level: {
        selectedLevelIds: [],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["level", "selectedLevelIds"]);
    }
  });

  it("accepts level sub-filter when at least one level is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.level],
      level: {
        selectedLevelIds: [12],
      },
    });

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects booking date sub-filter when absolute from date is missing", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate],
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

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual([
        "bookingDate",
        "absolute",
        "fromDate",
      ]);
    }
  });

  it("accepts booking date sub-filter with absolute on-or-after date", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate],
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

    const result = totalBookingNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  describe("booking date sub-filter — relative operators", () => {
    const buildRelativeBookingDateValue = (
      operator: (typeof RELATIVE_DATE_OPERATORS)[keyof typeof RELATIVE_DATE_OPERATORS],
      firstDays: number | null,
      secondDays: number | null,
    ) =>
      buildFormValue({
        subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate],
        bookingDate: {
          ...defaultDateFilterValue,
          dateType: DATE_FILTER_TYPE_RELATIVE,
          relative: {
            operator,
            firstDays,
            secondDays,
          },
        },
      });

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])(
      "rejects single-value operator %s when firstDays is missing",
      (operator) => {
        const value = buildRelativeBookingDateValue(operator, null, null);

        const result = totalBookingNumberFilterSchema.safeParse(value);

        expect(result.success).toBe(false);
        if (!result.success) {
          const issuePaths = result.error.issues.map((issue) => issue.path);
          expect(issuePaths).toContainEqual([
            "bookingDate",
            "relative",
            "firstDays",
          ]);
        }
      },
    );

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])("accepts single-value operator %s when firstDays is set", (operator) => {
      const value = buildRelativeBookingDateValue(operator, 30, null);

      const result = totalBookingNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(true);
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when secondDays is missing", (operator) => {
      const value = buildRelativeBookingDateValue(operator, 10, null);

      const result = totalBookingNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "bookingDate",
          "relative",
          "secondDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when firstDays is missing", (operator) => {
      const value = buildRelativeBookingDateValue(operator, null, null);

      const result = totalBookingNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "bookingDate",
          "relative",
          "secondDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])(
      "accepts between operator %s when both firstDays and secondDays are set",
      (operator) => {
        const value = buildRelativeBookingDateValue(operator, 10, 30);

        const result = totalBookingNumberFilterSchema.safeParse(value);

        expect(result.success).toBe(true);
      },
    );
    it("rejects booking hour range sub-filter when start time is after end time", () => {
      const value = buildFormValue({
        subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange],
        bookingHourRange: {
          hour: "18:00",
          hourSecond: "09:00",
        },
      });

      const result = totalBookingNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual(["bookingHourRange", "hourSecond"]);
      }
    });

    it("accepts booking hour range sub-filter when times are ordered", () => {
      const value = buildFormValue({
        subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange],
        bookingHourRange: {
          hour: "09:00",
          hourSecond: "18:00",
        },
      });

      const result = totalBookingNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(true);
    });
  });
});
