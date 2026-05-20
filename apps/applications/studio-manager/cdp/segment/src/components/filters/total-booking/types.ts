import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { TotalBookingNumberTypeValue } from "./constants";
import type { TotalBookingSubFilterId } from "./sub-filters/total-booking-sub-filter-id";

export type TotalBookingNumberType = TotalBookingNumberTypeValue;

export type TotalBookingNumberFilterFormValue = {
  id?: number;
  smartlist: number;
  type: TotalBookingNumberType;
  value: number;
  secondValue: number | null;
  subFilters: TotalBookingSubFilterId[];
  activity: {
    selectAllActivities: boolean;
    selectedMetaActivityIds: number[];
  };
  establishment: {
    selectAllEstablishments: boolean;
    selectedEstablishmentIds: number[];
  };
  coach: {
    selectAllCoaches: boolean;
    selectedCoachIds: number[];
  };
  paymentPack: {
    selectAllPaymentPacks: boolean;
    selectedPaymentPackIds: number[];
  };
  /** When the attendance sub-filter is on: `true` = present, `false` = absent. */
  attendanceMode: {
    attendance: boolean;
  };
  bookingDate: DateFilterValue;
  bookingHourRange: {
    hour: string;
    hourSecond: string;
  };
  level: {
    selectedLevelIds: number[];
  };
};

export type TotalBookingNumberDirtyPatchPayload = Partial<
  Omit<TotalBookingFilter, "id" | "company_id" | "filter_identifier">
>;

export type TotalBookingFilterCreatePayload = CreateTotalBookingFilterPayload;

export type TotalBookingNumberFilterCardProps = {
  smartlistId: string;
  /** Studio tenant, resolved once by the parent smartlist screen. */
  companyId: number;
  filterValue: TotalBookingNumberFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type { TotalBookingSubFilterId } from "./sub-filters/total-booking-sub-filter-id";
