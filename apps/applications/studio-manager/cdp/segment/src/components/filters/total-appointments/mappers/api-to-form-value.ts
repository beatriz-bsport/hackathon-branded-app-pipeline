import type { PrivateBookingsFilter } from "@bsport/api-cdp/smartlist";

import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
  TOTAL_APPOINTMENTS_NUMBER_TYPE,
  totalAppointmentsNumberComparatorToTypeMap,
} from "../constants";
import { REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS } from "../sub-filters/registry";
import type { TotalAppointmentsNumberFilterFormValue } from "../types";

/**
 * Maps a hydrated private bookings API filter to the total appointments form value.
 */
export const mapTotalAppointmentsFilterToFormValue = (
  filter: PrivateBookingsFilter,
): TotalAppointmentsNumberFilterFormValue => {
  const subFilters: TotalAppointmentsNumberFilterFormValue["subFilters"] = [];
  const partialFromModules: Partial<TotalAppointmentsNumberFilterFormValue> =
    {};

  for (const subFilterModule of REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS) {
    const moduleResult = subFilterModule.readFromApi(filter);
    if (moduleResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialFromModules, moduleResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    type:
      totalAppointmentsNumberComparatorToTypeMap[filter.comparator] ??
      TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
    value: filter.value ?? 0,
    secondValue:
      totalAppointmentsNumberComparatorToTypeMap[filter.comparator] ===
      TOTAL_APPOINTMENTS_NUMBER_TYPE.between
        ? (filter.value_second ?? null)
        : null,
    subFilters,
    bookingDate: defaultDateFilterValue,
    bookingHourRange: {
      hour: filter.hour ?? APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond:
        filter.hour_second ?? APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
    },
    coach: {
      selectAllCoaches: false,
      selectedCoachIds: [],
    },
    establishment: {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [],
      atHome: false,
    },
    privatePass: {
      selectAllPrivatePasses: false,
      selectedPrivatePassIds: [],
    },
    ...partialFromModules,
  };
};
