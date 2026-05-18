import { describe, expect, it, vi } from "vitest";

import { SmartlistTotalBookingComparator } from "@bsport/api-cdp/smartlist";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { toCreatePayload } from "#src/components/filters/total-booking/mappers/form-value-to-create-payload";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
import {
  DATE_FILTER_TYPE_RELATIVE,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("uses the smartlist id from form value", () => {
    const value = createDefaultTotalBookingNumberFilter(123);

    const payload = toCreatePayload(value);

    expect(payload.smartlist).toBe(123);
  });

  it("maps comparator and values for non-between types", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.type = TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual;
    value.value = 6;
    value.secondValue = null;

    const payload = toCreatePayload(value);

    expect(payload.comparator).toBe(SmartlistTotalBookingComparator.GTE);
    expect(payload.value).toBe(6);
    expect(payload.value_second).toBe(0);
  });

  it("maps value_second for between comparator", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.type = TOTAL_BOOKING_NUMBER_TYPE.between;
    value.value = 2;
    value.secondValue = 8;

    const payload = toCreatePayload(value);

    expect(payload.comparator).toBe(SmartlistTotalBookingComparator.BETWEEN);
    expect(payload.value).toBe(2);
    expect(payload.value_second).toBe(8);
  });

  it("keeps activity fields inactive when activity sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [5],
    };

    const payload = toCreatePayload(value);

    expect(payload.activity_filter_active).toBe(false);
    expect(payload.select_all_activities).toBe(true);
    expect(payload.meta_activities).toEqual([]);
  });

  it("activates activity fields when activity sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.activity];
    value.activity = {
      selectAllActivities: false,
      selectedMetaActivityIds: [5, 7],
    };

    const payload = toCreatePayload(value);

    expect(payload.activity_filter_active).toBe(true);
    expect(payload.select_all_activities).toBe(false);
    expect(payload.meta_activities).toEqual([5, 7]);
  });

  it("keeps establishment fields inactive when establishment sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [2],
    };

    const payload = toCreatePayload(value);

    expect(payload.establishment_filter_active).toBe(false);
    expect(payload.select_all_establishments).toBe(true);
    expect(payload.establishments).toEqual([]);
  });

  it("activates establishment fields when establishment sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [2, 8],
    };

    const payload = toCreatePayload(value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.select_all_establishments).toBe(false);
    expect(payload.establishments).toEqual([2, 8]);
  });

  it("keeps coach fields inactive when coach sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [3],
    };

    const payload = toCreatePayload(value);

    expect(payload.coach_filter_active).toBe(false);
    expect(payload.select_all_coaches).toBe(true);
    expect(payload.coaches).toEqual([]);
  });

  it("activates coach fields when coach sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.coach];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [3, 9],
    };

    const payload = toCreatePayload(value);

    expect(payload.coach_filter_active).toBe(true);
    expect(payload.select_all_coaches).toBe(false);
    expect(payload.coaches).toEqual([3, 9]);
  });

  it("keeps payment pack fields inactive when payment pack sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.paymentPack = {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [1],
    };

    const payload = toCreatePayload(value);

    expect(payload.payment_pack_filter_active).toBe(false);
    expect(payload.select_all_payment_packs).toBe(true);
    expect(payload.payment_packs).toEqual([]);
  });

  it("activates payment pack fields when payment pack sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack];
    value.paymentPack = {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [1, 2],
    };

    const payload = toCreatePayload(value);

    expect(payload.payment_pack_filter_active).toBe(true);
    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([1, 2]);
  });

  it("keeps level fields inactive when level sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.level = {
      selectedLevelIds: [5],
    };

    const payload = toCreatePayload(value);

    expect(payload.level_filter_active).toBe(false);
    expect(payload.level).toEqual([]);
  });

  it("activates level fields when level sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.level];
    value.level = {
      selectedLevelIds: [5, 9],
    };

    const payload = toCreatePayload(value);

    expect(payload.level_filter_active).toBe(true);
    expect(payload.level).toEqual([5, 9]);
  });

  it("keeps date filter inactive when booking date sub-filter is not selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
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

    const payload = toCreatePayload(value);

    expect(payload.date_filter_active).toBe(false);
  });

  it("activates date filter API fields when booking date sub-filter is selected", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate];
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

  describe("booking date sub-filter — isolation between absolute and relative payload fields", () => {
    const buildWithBookingDate = (
      bookingDate: ReturnType<
        typeof createDefaultTotalBookingNumberFilter
      >["bookingDate"],
    ) => ({
      ...createDefaultTotalBookingNumberFilter(1),
      subFilters: [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate],
      bookingDate,
    });

    describe("absolute date mode", () => {
      it("emits zero duration fields when relative days are not set", () => {
        const value = buildWithBookingDate({
          dateType: "absolute",
          absolute: {
            operator: "on_or_after",
            fromDate: "2026-06-01",
            toDate: null,
          },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
            firstDays: null,
            secondDays: null,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(0);
        expect(Math.abs(payload.duration_second ?? 0)).toBe(0);
      });

      it("emits zero duration fields for between operator when relative days are not set", () => {
        const value = buildWithBookingDate({
          dateType: "absolute",
          absolute: {
            operator: "between",
            fromDate: "2026-01-01",
            toDate: "2026-03-31",
          },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
            firstDays: null,
            secondDays: null,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(0);
        expect(Math.abs(payload.duration_second ?? 0)).toBe(0);
      });
    });

    describe("relative date mode — single-value operators", () => {
      it.each([
        {
          operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
          days: 30,
          expectedDuration: -30,
        },
        {
          operator: RELATIVE_DATE_OPERATORS.pastExactly,
          days: 7,
          expectedDuration: -7,
        },
        {
          operator: RELATIVE_DATE_OPERATORS.futureMoreThan,
          days: 14,
          expectedDuration: 14,
        },
        {
          operator: RELATIVE_DATE_OPERATORS.futureExactly,
          days: 21,
          expectedDuration: 21,
        },
      ])(
        "emits signed duration for $operator and zero duration_second when secondDays is not set",
        ({ operator, days, expectedDuration }) => {
          const value = buildWithBookingDate({
            dateType: DATE_FILTER_TYPE_RELATIVE,
            absolute: { operator: "on_or_after", fromDate: null, toDate: null },
            relative: { operator, firstDays: days, secondDays: null },
          });

          const payload = toCreatePayload(value);

          expect(payload.duration).toBe(expectedDuration);
          expect(Math.abs(payload.duration_second ?? 0)).toBe(0);
        },
      );

      it("does not carry a stale absolute fromDate into duration fields", () => {
        const value = buildWithBookingDate({
          dateType: DATE_FILTER_TYPE_RELATIVE,
          absolute: {
            operator: "on_or_after",
            fromDate: "2026-06-01",
            toDate: null,
          },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
            firstDays: 30,
            secondDays: null,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(-30);
        expect(payload.date).toBe("2026-06-01");
      });
    });

    describe("relative date mode — between operators", () => {
      it("emits both signed negative durations for past_between", () => {
        const value = buildWithBookingDate({
          dateType: DATE_FILTER_TYPE_RELATIVE,
          absolute: { operator: "on_or_after", fromDate: null, toDate: null },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.pastBetween,
            firstDays: 10,
            secondDays: 30,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(-10);
        expect(payload.duration_second).toBe(-30);
      });

      it("emits both positive durations for future_between", () => {
        const value = buildWithBookingDate({
          dateType: DATE_FILTER_TYPE_RELATIVE,
          absolute: { operator: "on_or_after", fromDate: null, toDate: null },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.futureBetween,
            firstDays: 5,
            secondDays: 20,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(5);
        expect(payload.duration_second).toBe(20);
      });

      it("does not carry absolute date values into duration fields for past_between", () => {
        const value = buildWithBookingDate({
          dateType: DATE_FILTER_TYPE_RELATIVE,
          absolute: {
            operator: "between",
            fromDate: "2026-01-01",
            toDate: "2026-03-31",
          },
          relative: {
            operator: RELATIVE_DATE_OPERATORS.pastBetween,
            firstDays: 10,
            secondDays: 30,
          },
        });

        const payload = toCreatePayload(value);

        expect(payload.duration).toBe(-10);
        expect(payload.duration_second).toBe(-30);
        expect(payload.date).toBe("2026-01-01");
        expect(payload.date_second).toBe("2026-03-31");
      });
    });
  });
});
