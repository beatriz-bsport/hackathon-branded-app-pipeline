import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { TOTAL_BOOKING_NUMBER_TYPE } from "./constants";
import type { TotalBookingNumberFilterFormValue } from "./types";

export const createDefaultTotalBookingNumberFilter = (
  smartlistId: number,
): TotalBookingNumberFilterFormValue => ({
  smartlist: smartlistId,
  type: TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual,
  value: 1,
  secondValue: null,
  subFilters: [],
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
  attendanceMode: {
    attendance: true,
  },
  bookingDate: createDefaultDateFilterValue(),
  bookingHourRange: {
    hour: "00:00",
    hourSecond: "23:59",
  },
  level: {
    selectedLevelIds: [],
  },
});
