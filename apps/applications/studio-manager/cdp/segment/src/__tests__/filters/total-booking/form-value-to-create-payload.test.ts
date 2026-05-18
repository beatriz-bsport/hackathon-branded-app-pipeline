import { describe, expect, it, vi } from "vitest";

import { SmartlistTotalBookingComparator } from "@bsport/api-cdp/smartlist";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { toCreatePayload } from "#src/components/filters/total-booking/mappers/form-value-to-create-payload";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";

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
});
