import type { PrivateBookingFilterParams } from "@bsport/api-book";
import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import { AppointmentFilterTypes } from "./types";

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
    if (filter.field === AppointmentFilterTypes.TEACHER) {
      Object.assign(params, getNumericInFilterParam(filter, "coach__in"));
    } else if (filter.field === AppointmentFilterTypes.ESTABLISHMENT) {
      Object.assign(
        params,
        getNumericInFilterParam(filter, "establishment__in"),
      );
    } else if (filter.field === AppointmentFilterTypes.PARTICIPANT) {
      Object.assign(params, getNumericInFilterParam(filter, "member__in"));
    }
    // Note that AppointmentFilterTypes.NAME and AppointmentFilterTypes.PASS_USED are client-side only (no server-side filter params)
    return params;
  }, {});
};
