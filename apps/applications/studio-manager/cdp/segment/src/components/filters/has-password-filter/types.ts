import type {
  CreateHasPasswordFilterPayload,
  UpdateHasPasswordFilterPayload,
} from "@bsport/api-cdp/smartlist";

export type HasPasswordFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type HasPasswordFilterCreatePayload = CreateHasPasswordFilterPayload;

export type HasPasswordFilterDirtyPatchPayload = UpdateHasPasswordFilterPayload;

export type HasPasswordFilterCardProps = {
  smartlistId: string;
  filterValue: HasPasswordFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
