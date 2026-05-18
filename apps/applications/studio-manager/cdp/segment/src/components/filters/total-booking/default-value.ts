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
  level: {
    selectedLevelIds: [],
  },
});
