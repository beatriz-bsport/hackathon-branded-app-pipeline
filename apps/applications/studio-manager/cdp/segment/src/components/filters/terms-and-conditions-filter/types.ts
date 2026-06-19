import type {
  CreateTermsAndConditionsFilterPayload,
  UpdateTermsAndConditionsFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type TermsAndConditionsFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type TermsAndConditionsFilterCreatePayload =
  CreateTermsAndConditionsFilterPayload;

export type TermsAndConditionsFilterDirtyPatchPayload =
  UpdateTermsAndConditionsFilterPayload;

export type TermsAndConditionsFilterCardProps =
  SegmentFilterCardProps<TermsAndConditionsFilterFormValue>;
