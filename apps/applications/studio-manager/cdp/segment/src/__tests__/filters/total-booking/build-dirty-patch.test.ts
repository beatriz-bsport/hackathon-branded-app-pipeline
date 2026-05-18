import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/total-booking/mappers/build-dirty-patch";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "#src/components/filters/total-booking/types";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TotalBookingNumberFilterFormValue>>
>;

describe("buildDirtyPatchPayload", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator/value fields when comparator section is dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.type = TOTAL_BOOKING_NUMBER_TYPE.equal;
    value.value = 4;
    const dirtyFields: DirtyFields = { type: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.comparator).toBe(5);
    expect(payload.value).toBe(4);
    expect(payload.value_second).toBe(0);
  });

  it("emits between value_second when between comparator is dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.type = TOTAL_BOOKING_NUMBER_TYPE.between;
    value.value = 1;
    value.secondValue = 6;
    const dirtyFields: DirtyFields = {
      secondValue: true,
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.comparator).toBe(6);
    expect(payload.value).toBe(1);
    expect(payload.value_second).toBe(6);
  });

  it("emits active activity slice when activity sub-filter values are dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.activity];
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
    const value = createDefaultTotalBookingNumberFilter(1);
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
    expect(payload.select_all_activities).toBe(true);
    expect(payload.meta_activities).toEqual([]);
  });

  it("emits active establishment slice when establishment sub-filter values are dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [4],
    };
    const dirtyFields: DirtyFields = {
      establishment: { selectedEstablishmentIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.select_all_establishments).toBe(false);
    expect(payload.establishments).toEqual([4]);
  });

  it("emits inactive establishment slice when establishment sub-filter is removed", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.establishment = {
      selectAllEstablishments: true,
      selectedEstablishmentIds: [],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(false);
    expect(payload.select_all_establishments).toBe(true);
    expect(payload.establishments).toEqual([]);
  });

  it("emits active coach slice when coach sub-filter values are dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.coach];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [9],
    };
    const dirtyFields: DirtyFields = {
      coach: { selectedCoachIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.coach_filter_active).toBe(true);
    expect(payload.select_all_coaches).toBe(false);
    expect(payload.coaches).toEqual([9]);
  });

  it("emits inactive coach slice when coach sub-filter is removed", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.coach = {
      selectAllCoaches: true,
      selectedCoachIds: [],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.coach_filter_active).toBe(false);
    expect(payload.select_all_coaches).toBe(true);
    expect(payload.coaches).toEqual([]);
  });

  it("emits active payment pack slice when payment pack sub-filter values are dirty", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack];
    value.paymentPack = {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [44],
    };
    const dirtyFields: DirtyFields = {
      paymentPack: { selectedPaymentPackIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.payment_pack_filter_active).toBe(true);
    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([44]);
  });

  it("emits inactive payment pack slice when payment pack sub-filter is removed", () => {
    const value = createDefaultTotalBookingNumberFilter(1);
    value.subFilters = [];
    value.paymentPack = {
      selectAllPaymentPacks: true,
      selectedPaymentPackIds: [],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.payment_pack_filter_active).toBe(false);
    expect(payload.select_all_payment_packs).toBe(true);
    expect(payload.payment_packs).toEqual([]);
  });
});
