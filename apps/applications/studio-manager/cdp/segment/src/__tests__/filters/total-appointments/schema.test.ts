import { describe, expect, it, vi } from "vitest";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { totalAppointmentsNumberFilterSchema } from "#src/components/filters/total-appointments/schema";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "#src/components/filters/total-appointments/sub-filters/total-appointments-sub-filter-id";
import type { TotalAppointmentsNumberFilterFormValue } from "#src/components/filters/total-appointments/types";
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
  overrides: Partial<TotalAppointmentsNumberFilterFormValue> = {},
): TotalAppointmentsNumberFilterFormValue => ({
  ...createDefaultTotalAppointmentsNumberFilter(1),
  ...overrides,
});

describe("totalAppointmentsNumberFilterSchema", () => {
  it("accepts a valid default form value", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("requires second value for between comparator", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.secondValue = null;

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between range when second value is lower than first", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
    value.value = 5;
    value.secondValue = 2;

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects booking date sub-filter when absolute from date is missing", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate],
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

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

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
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate],
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

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  describe("booking date sub-filter — relative operators", () => {
    const buildRelativeBookingDateValue = (
      operator: (typeof RELATIVE_DATE_OPERATORS)[keyof typeof RELATIVE_DATE_OPERATORS],
      firstDays: number | null,
      secondDays: number | null,
    ) =>
      buildFormValue({
        subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate],
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

        const result = totalAppointmentsNumberFilterSchema.safeParse(value);

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

      const result = totalAppointmentsNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(true);
    });
  });

  it("rejects booking hour range sub-filter when start time is after end time", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "18:00",
        hourSecond: "09:00",
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["bookingHourRange", "hourSecond"]);
    }
  });

  it("accepts booking hour range sub-filter when times are ordered", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "09:00",
        hourSecond: "18:00",
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts booking hour range sub-filter when hour fields are empty and defaults apply", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "",
        hourSecond: "",
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects booking hour range sub-filter when hour fields are invalid", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange],
      bookingHourRange: {
        hour: "invalid",
        hourSecond: "18:00",
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["bookingHourRange", "hour"]);
    }
  });

  it("rejects coach sub-filter when active and no coach is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach],
      coach: {
        selectAllCoaches: false,
        selectedCoachIds: [],
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["coach", "selectedCoachIds"]);
    }
  });

  it("accepts coach sub-filter when at least one coach is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach],
      coach: {
        selectAllCoaches: false,
        selectedCoachIds: [101, 102],
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  describe("establishment sub-filter", () => {
    it("rejects establishment sub-filter when no establishment is selected and at home is unchecked", () => {
      const value = buildFormValue({
        subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment],
        establishment: {
          selectAllEstablishments: false,
          selectedEstablishmentIds: [],
          atHome: false,
        },
      });

      const result = totalAppointmentsNumberFilterSchema.safeParse(value);

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
        subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment],
        establishment: {
          selectAllEstablishments: false,
          selectedEstablishmentIds: [7],
          atHome: false,
        },
      });

      const result = totalAppointmentsNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(true);
    });

    it("accepts establishment sub-filter when only at home is selected", () => {
      const value = buildFormValue({
        subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment],
        establishment: {
          selectAllEstablishments: false,
          selectedEstablishmentIds: [],
          atHome: true,
        },
      });

      const result = totalAppointmentsNumberFilterSchema.safeParse(value);

      expect(result.success).toBe(true);
    });
  });
});

describe("appointment pass sub-filter", () => {
  it("rejects appointment pass sub-filter when no appointment pass is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass],
      privatePass: {
        selectAllPrivatePasses: false,
        selectedPrivatePassIds: [],
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual([
        "privatePass",
        "selectedPrivatePassIds",
      ]);
    }
  });

  it("accepts appointment pass sub-filter when at least one appointment pass is selected", () => {
    const value = buildFormValue({
      subFilters: [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass],
      privatePass: {
        selectAllPrivatePasses: false,
        selectedPrivatePassIds: [501],
      },
    });

    const result = totalAppointmentsNumberFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });
});
