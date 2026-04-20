import type { PrivateBookingFilterParams } from "@bsport/api-book";
import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import { AppointmentFilterTypes } from "./types";

const getNumericFilterParam = (
  filter: FilterElementState,
  key: keyof PrivateBookingFilterParams,
): Partial<PrivateBookingFilterParams> | null => {
  const id = Number(filter.valueIds[0]);
  if (!id || isNaN(id)) {
    return null;
  }
  return { [key]: id };
};

export const getAppointmentParamsFromFilters = (
  filters: FilterElementState[],
): PrivateBookingFilterParams => {
  return filters.reduce<PrivateBookingFilterParams>((params, filter) => {
    if (filter.field === AppointmentFilterTypes.TEACHER) {
      Object.assign(params, getNumericFilterParam(filter, "coach"));
    } else if (filter.field === AppointmentFilterTypes.ESTABLISHMENT) {
      Object.assign(params, getNumericFilterParam(filter, "establishment"));
    } else if (filter.field === AppointmentFilterTypes.PARTICIPANT) {
      Object.assign(params, getNumericFilterParam(filter, "member"));
    }
    // Note that AppointmentFilterTypes.NAME and AppointmentFilterTypes.PASS_USED are client-side only (no server-side filter params)
    return params;
  }, {});
};
