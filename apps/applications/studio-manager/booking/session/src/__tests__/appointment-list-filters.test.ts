import { describe, expect, it } from "vitest";

import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import { getAppointmentParamsFromFilters } from "#src/components/AppointmentList/Filters/get-appointment-params-from-filters";
import {
  AT_HOME_FILTER_ID,
  AppointmentFilterTypes,
  AppointmentFilters,
  NO_VALUE_FILTER_ID,
} from "#src/components/AppointmentList/Filters/types";

const createFilter = (
  field: AppointmentFilterTypes,
  valueIds: string[],
): FilterElementState => ({
  id: 1,
  field,
  filter: AppointmentFilters.FILTER_IS,
  valueIds,
});

describe("appointment-list-filters", () => {
  it("maps teacher ids to coach__in", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.TEACHER, ["3", "7"]),
      ]),
    ).toEqual({ coach__in: [3, 7] });
  });

  it("maps the No teacher sentinel to coach__isnull", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.TEACHER, [NO_VALUE_FILTER_ID]),
      ]),
    ).toEqual({ coach__isnull: true });
  });

  it("co-selects teacher ids with No teacher (OR — emits both params)", () => {
    // Relies on the BE OR-combining coach filter (BOO-3237).
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.TEACHER, ["3", NO_VALUE_FILTER_ID]),
      ]),
    ).toEqual({ coach__in: [3], coach__isnull: true });
  });

  it("maps establishment ids to establishment__in", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.ESTABLISHMENT, ["12"]),
      ]),
    ).toEqual({ establishment__in: [12] });
  });

  it("maps the No venue sentinel to establishment__isnull", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.ESTABLISHMENT, [
          NO_VALUE_FILTER_ID,
        ]),
      ]),
    ).toEqual({ establishment__isnull: true });
  });

  it("maps the At home sentinel to is_home_service", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.ESTABLISHMENT, [AT_HOME_FILTER_ID]),
      ]),
    ).toEqual({ is_home_service: true });
  });

  it("co-selects venues with No venue and At home (OR — emits all params)", () => {
    // Relies on the BE OR-combining venue filter (BOO-3237).
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.ESTABLISHMENT, [
          "12",
          NO_VALUE_FILTER_ID,
          AT_HOME_FILTER_ID,
        ]),
      ]),
    ).toEqual({
      establishment__in: [12],
      establishment__isnull: true,
      is_home_service: true,
    });
  });

  it("maps participant ids to member__in", () => {
    expect(
      getAppointmentParamsFromFilters([
        createFilter(AppointmentFilterTypes.PARTICIPANT, ["5"]),
      ]),
    ).toEqual({ member__in: [5] });
  });
});
