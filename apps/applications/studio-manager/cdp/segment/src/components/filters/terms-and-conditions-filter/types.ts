import type {
  CreateTermsAndConditionsFilterPayload,
  UpdateTermsAndConditionsFilterPayload,
} from "@bsport/api-cdp/smartlist";

export type TermsAndConditionsFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type TermsAndConditionsFilterCreatePayload =
  CreateTermsAndConditionsFilterPayload;

export type TermsAndConditionsFilterDirtyPatchPayload =
  UpdateTermsAndConditionsFilterPayload;

export type TermsAndConditionsFilterCardProps = {
  smartlistId: string;
  filterValue: TermsAndConditionsFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
