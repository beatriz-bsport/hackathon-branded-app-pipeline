import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type { TotalBookingNumberTypeValue } from "./constants";

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
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type TotalBookingSubFilterId = "activity";
