import type { PrivateBookingFilterParams } from "@bsport/api-book";
import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  AT_HOME_FILTER_ID,
  AppointmentFilterTypes,
  NO_VALUE_FILTER_ID,
} from "./types";

const getNumericInFilterParam = (
  filter: FilterElementState,
  key: "coach__in" | "establishment__in" | "member__in",
): Partial<PrivateBookingFilterParams> | null => {
  const ids = filter.valueIds
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));
  if (ids.length === 0) {
    return null;
  }
  return { [key]: ids };
};

export const getAppointmentParamsFromFilters = (
  filters: FilterElementState[],
): PrivateBookingFilterParams => {
  return filters.reduce<PrivateBookingFilterParams>((params, filter) => {
    // Sentinels and specific ids are emitted together; the backend OR-combines
    // them into one filter (BOO-3237), so "Barcelona OR No venue OR At home"
    // and "Alice OR No teacher" are valid selections.
    if (filter.field === AppointmentFilterTypes.TEACHER) {
      Object.assign(params, getNumericInFilterParam(filter, "coach__in"));
      if (filter.valueIds.includes(NO_VALUE_FILTER_ID)) {
        Object.assign(params, { coach__isnull: true });
      }
    } else if (filter.field === AppointmentFilterTypes.ESTABLISHMENT) {
      Object.assign(
        params,
        getNumericInFilterParam(filter, "establishment__in"),
      );
      if (filter.valueIds.includes(NO_VALUE_FILTER_ID)) {
        // "No venue" → genuinely unassigned (the backend excludes at-home).
        Object.assign(params, { establishment__isnull: true });
      }
      if (filter.valueIds.includes(AT_HOME_FILTER_ID)) {
        Object.assign(params, { is_home_service: true });
      }
    } else if (filter.field === AppointmentFilterTypes.PARTICIPANT) {
      Object.assign(params, getNumericInFilterParam(filter, "member__in"));
    }
    // Note that AppointmentFilterTypes.NAME and AppointmentFilterTypes.PASS_USED are client-side only (no server-side filter params)
    return params;
  }, {});
};
