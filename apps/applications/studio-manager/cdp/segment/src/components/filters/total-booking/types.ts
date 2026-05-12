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
};

export type TotalBookingNumberDirtyPatchPayload = Partial<
  Omit<TotalBookingFilter, "id" | "company_id" | "filter_identifier">
>;

export type TotalBookingFilterCreatePayload = CreateTotalBookingFilterPayload;

export type TotalBookingNumberFilterCardProps = {
  smartlistId: string;
  filterValue: TotalBookingNumberFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
