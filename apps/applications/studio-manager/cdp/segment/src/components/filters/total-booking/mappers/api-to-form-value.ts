import type { TotalBookingFilter } from "@bsport/api-cdp/smartlist";

import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import {
  TOTAL_BOOKING_NUMBER_TYPE,
  totalBookingNumberComparatorToTypeMap,
} from "../constants";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "../sub-filters/registry";
import type { TotalBookingNumberFilterFormValue } from "../types";

export const mapTotalBookingFilterToFormValue = (
  filter: TotalBookingFilter,
): TotalBookingNumberFilterFormValue => {
  const subFilters: TotalBookingNumberFilterFormValue["subFilters"] = [];
  const partialFromModules: Partial<TotalBookingNumberFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
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
      totalBookingNumberComparatorToTypeMap[filter.comparator] ??
      TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual,
    value: filter.value ?? 0,
    secondValue:
      filter.comparator === undefined ||
      totalBookingNumberComparatorToTypeMap[filter.comparator] !==
        TOTAL_BOOKING_NUMBER_TYPE.between
        ? null
        : (filter.value_second ?? null),
    subFilters,
    activity: {
      selectAllActivities: false,
      selectedMetaActivityIds: [],
    },
    establishment: {
      selectAllEstablishments: false,
      selectedEstablishmentIds: [],
    },
    coach: {
      selectAllCoaches: false,
      selectedCoachIds: [],
    },
    paymentPack: {
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [],
    },
    bookingDate: defaultDateFilterValue,
    bookingHourRange: {
      hour: "00:00",
      hourSecond: "23:59",
    },
    level: {
      selectedLevelIds: [],
    },
    attendanceMode: {
      attendance: false,
    },
    ...partialFromModules,
  };
};
