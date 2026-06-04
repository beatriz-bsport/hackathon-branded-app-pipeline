import type {
  CreateHasPhoneFilterPayload,
  UpdateHasPhoneFilterPayload,
} from "@bsport/api-cdp/smartlist";

export type HasPhoneFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type HasPhoneFilterCreatePayload = CreateHasPhoneFilterPayload;

export type HasPhoneFilterDirtyPatchPayload = UpdateHasPhoneFilterPayload;

export type HasPhoneFilterCardProps = {
  smartlistId: string;
  filterValue: HasPhoneFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
