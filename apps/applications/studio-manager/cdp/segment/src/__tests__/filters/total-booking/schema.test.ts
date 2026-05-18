import { describe, expect, it, vi } from "vitest";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { totalBookingNumberFilterSchema } from "#src/components/filters/total-booking/schema";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "#src/components/filters/total-booking/types";

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
});
