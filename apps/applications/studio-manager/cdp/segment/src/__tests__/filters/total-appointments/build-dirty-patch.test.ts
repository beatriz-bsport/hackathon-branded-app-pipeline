import { describe, expect, it, vi } from "vitest";

import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "#src/components/filters/total-appointments/constants";
import { createDefaultTotalAppointmentsNumberFilter } from "#src/components/filters/total-appointments/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/total-appointments/mappers/build-dirty-patch";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "#src/components/filters/total-appointments/sub-filters/total-appointments-sub-filter-id";
import type { TotalAppointmentsNumberFilterFormValue } from "#src/components/filters/total-appointments/types";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TotalAppointmentsNumberFilterFormValue>>
>;

describe("buildDirtyPatchPayload (total appointments)", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator/value fields when comparator section is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.equal;
    value.value = 4;
    const dirtyFields: DirtyFields = { type: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.comparator).toBe(5);
    expect(payload.value).toBe(4);
    expect(payload.value_second).toBe(0);
  });

  it("emits between value_second when between comparator is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.type = TOTAL_APPOINTMENTS_NUMBER_TYPE.between;
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

  it("emits active booking date slice when booking date is added as sub-filter", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate];
    value.bookingDate = {
      ...value.bookingDate,
      dateType: "absolute",
      absolute: {
        ...value.bookingDate.absolute,
        operator: "on_or_after",
        fromDate: "2026-04-10",
        toDate: null,
      },
    };
    const dirtyFields: DirtyFields = {
      subFilters: [true],
      bookingDate: {
        absolute: {
          fromDate: true,
        },
      },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date).toBe("2026-04-10");
  });

  it("emits inactive booking date slice when booking date sub-filter is removed", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.date_filter_active).toBe(false);
  });

  it("emits active booking hour range slice when booking hour range values are dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange];
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

  it("emits inactive booking hour range slice when booking hour range sub-filter is removed", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.hour_filter_active).toBe(false);
    expect(payload.hour).toBeNull();
    expect(payload.hour_second).toBeNull();
  });

  it("emits active coach slice when coach sub-filter values are dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach];
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
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    value.coach = {
      selectAllCoaches: false,
      selectedCoachIds: [9],
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.coach_filter_active).toBe(false);
    expect(payload.select_all_coaches).toBe(true);
    expect(payload.coaches).toEqual([]);
  });

  it("emits active establishment slice when establishment sub-filter values are dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [4],
      atHome: true,
    };
    const dirtyFields: DirtyFields = {
      establishment: { selectedEstablishmentIds: [true] },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.select_all_establishments).toBe(false);
    expect(payload.establishments).toEqual([4]);
    expect(payload.at_home).toBe(true);
  });

  it("emits inactive establishment slice when establishment sub-filter is removed", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [4],
      atHome: true,
    };
    const dirtyFields: DirtyFields = {
      subFilters: [],
    } as DirtyFields;

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(false);
    expect(payload.select_all_establishments).toBe(true);
    expect(payload.establishments).toEqual([]);
    expect(payload.at_home).toBe(false);
  });

  it("emits at_home when only the at home checkbox is dirty", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [4],
      atHome: true,
    };
    const dirtyFields: DirtyFields = {
      establishment: { atHome: true },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.at_home).toBe(true);
  });

  it("emits empty establishments when only at home is selected", () => {
    const value = createDefaultTotalAppointmentsNumberFilter(1);
    value.subFilters = [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment];
    value.establishment = {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [],
      atHome: true,
    };
    const dirtyFields: DirtyFields = {
      establishment: { atHome: true },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.establishment_filter_active).toBe(true);
    expect(payload.establishments).toEqual([]);
    expect(payload.at_home).toBe(true);
  });
});
