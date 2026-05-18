import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type { PassOption } from "#src/components/filters/passes-filter/types";
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
  bookingDate: DateFilterValue;
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
  filterValue: TotalBookingNumberFilterFormValue;
  activityOptions: {
    id: number;
    name: string;
  }[];
  establishmentOptions: {
    id: number;
    name: string;
  }[];
  coachOptions: {
    id: number;
    name: string;
  }[];
  passOptions: PassOption[];
  levelOptions: {
    id: number;
    name: string;
  }[];
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type { TotalBookingSubFilterId } from "./sub-filters/total-booking-sub-filter-id";
