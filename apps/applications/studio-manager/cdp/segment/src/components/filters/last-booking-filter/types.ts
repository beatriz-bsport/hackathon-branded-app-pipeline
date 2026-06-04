import type {
  CreateLastBookingFilterPayload,
  UpdateLastBookingFilterPayload,
} from "@bsport/api-cdp/smartlist";

export type LastBookingFilterFormValue = {
  id?: number;
  smartlist: number;
  /** `null` on a new draft until the user enters a number of days. */
  value: number | null;
};

export type LastBookingFilterCreatePayload = CreateLastBookingFilterPayload;

export type LastBookingFilterDirtyPatchPayload = UpdateLastBookingFilterPayload;

export type LastBookingFilterCardProps = {
  smartlistId: string;
  filterValue: LastBookingFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
