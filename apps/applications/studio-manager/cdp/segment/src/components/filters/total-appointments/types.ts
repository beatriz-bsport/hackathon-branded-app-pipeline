import type {
  CreatePrivateBookingsFilterPayload,
  PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import type { TotalAppointmentsNumberTypeValue } from "./constants";

export type TotalAppointmentsNumberType = TotalAppointmentsNumberTypeValue;

export type TotalAppointmentsNumberFilterFormValue = {
  id?: number;
  smartlist: number;
  type: TotalAppointmentsNumberType;
  value: number;
  secondValue: number | null;
};

export type TotalAppointmentsNumberDirtyPatchPayload = Partial<
  Omit<PrivateBookingsFilter, "id" | "company_id" | "filter_identifier">
>;

export type TotalAppointmentsFilterCreatePayload =
  CreatePrivateBookingsFilterPayload;

export type TotalAppointmentsNumberFilterCardProps = {
  smartlistId: string;
  /** Studio tenant, resolved once by the parent smartlist screen. */
  companyId: number;
  filterValue: TotalAppointmentsNumberFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
