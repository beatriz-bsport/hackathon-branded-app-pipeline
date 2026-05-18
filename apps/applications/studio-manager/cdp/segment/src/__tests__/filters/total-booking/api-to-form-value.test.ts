import { describe, expect, it, vi } from "vitest";

import {
  SmartlistDateFilterType,
  SmartlistTotalBookingComparator,
  type TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { TOTAL_BOOKING_NUMBER_TYPE } from "#src/components/filters/total-booking/constants";
import { mapTotalBookingFilterToFormValue } from "#src/components/filters/total-booking/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const TOTAL_BOOKING_FILTER_IDENTIFIER = 22;

const buildApiFilter = (
  overrides: Partial<TotalBookingFilter> = {},
): TotalBookingFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: TOTAL_BOOKING_FILTER_IDENTIFIER,
  comparator: SmartlistTotalBookingComparator.GTE,
  value: 3,
  value_second: 0,
  select_all_activities: true,
  activity_filter_active: false,
  meta_activities: [],
  select_all_establishments: true,
  establishment_filter_active: false,
  establishments: [],
  select_all_payment_packs: true,
  payment_pack_filter_active: false,
  payment_packs: [],
  select_all_coaches: true,
  coach_filter_active: false,
  coaches: [],
  level_filter_active: false,
  level: [],
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_EXACT,
  date: null,
  date_second: null,
  duration: null,
  duration_second: null,
  hour_filter_active: null,
  hour: null,
  hour_second: null,
  attendance_filter_active: null,
  attendance: null,
  ...overrides,
});

describe("mapTotalBookingFilterToFormValue", () => {
  it("preserves id and smartlist id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });

  it("maps comparator to local type", () => {
    const filter = buildApiFilter({
      comparator: SmartlistTotalBookingComparator.LTE,
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.type).toBe(TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual);
  });

  it("maps second value only for between comparator", () => {
    const betweenFilter = buildApiFilter({
      comparator: SmartlistTotalBookingComparator.BETWEEN,
      value_second: 9,
    });
    const gteFilter = buildApiFilter({
      comparator: SmartlistTotalBookingComparator.GTE,
      value_second: 9,
    });

    const betweenFormValue = mapTotalBookingFilterToFormValue(betweenFilter);
    const gteFormValue = mapTotalBookingFilterToFormValue(gteFilter);

    expect(betweenFormValue.secondValue).toBe(9);
    expect(gteFormValue.secondValue).toBeNull();
  });

  it("activates activity sub-filter when API activity filter is active", () => {
    const filter = buildApiFilter({
      activity_filter_active: true,
      select_all_activities: false,
      meta_activities: [10, 20],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["activity"]);
    expect(formValue.activity.selectAllActivities).toBe(false);
    expect(formValue.activity.selectedMetaActivityIds).toEqual([10, 20]);
  });

  it("keeps activity sub-filter disabled defaults when API activity filter is inactive", () => {
    const filter = buildApiFilter({
      activity_filter_active: false,
      select_all_activities: true,
      meta_activities: [],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
    expect(formValue.activity.selectAllActivities).toBe(true);
    expect(formValue.activity.selectedMetaActivityIds).toEqual([]);
  });

  it("activates establishment sub-filter when API establishment filter is active", () => {
    const filter = buildApiFilter({
      establishment_filter_active: true,
      select_all_establishments: false,
      establishments: [3, 4],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["establishment"]);
    expect(formValue.establishment.selectAllEstablishments).toBe(false);
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([3, 4]);
  });

  it("keeps establishment sub-filter disabled defaults when API establishment filter is inactive", () => {
    const filter = buildApiFilter({
      establishment_filter_active: false,
      select_all_establishments: true,
      establishments: [],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
    expect(formValue.establishment.selectAllEstablishments).toBe(true);
    expect(formValue.establishment.selectedEstablishmentIds).toEqual([]);
  });

  it("activates coach sub-filter when API coach filter is active", () => {
    const filter = buildApiFilter({
      coach_filter_active: true,
      select_all_coaches: false,
      coaches: [55, 66],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["coach"]);
    expect(formValue.coach.selectAllCoaches).toBe(false);
    expect(formValue.coach.selectedCoachIds).toEqual([55, 66]);
  });

  it("keeps coach sub-filter disabled defaults when API coach filter is inactive", () => {
    const filter = buildApiFilter({
      coach_filter_active: false,
      select_all_coaches: true,
      coaches: [],
    });

    const formValue = mapTotalBookingFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
    expect(formValue.coach.selectAllCoaches).toBe(true);
    expect(formValue.coach.selectedCoachIds).toEqual([]);
  });
});
