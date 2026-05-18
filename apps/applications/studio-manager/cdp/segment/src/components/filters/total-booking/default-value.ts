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
    selectAllActivities: true,
    selectedMetaActivityIds: [],
  },
});
