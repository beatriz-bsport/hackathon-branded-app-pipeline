import type {
  CreateLiabilityWaiverFilterPayload,
  UpdateLiabilityWaiverFilterPayload,
} from "@bsport/api-cdp/smartlist";

export type LiabilityWaiverFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type LiabilityWaiverFilterCreatePayload =
  CreateLiabilityWaiverFilterPayload;

export type LiabilityWaiverFilterDirtyPatchPayload =
  UpdateLiabilityWaiverFilterPayload;

export type LiabilityWaiverFilterCardProps = {
  smartlistId: string;
  filterValue: LiabilityWaiverFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
