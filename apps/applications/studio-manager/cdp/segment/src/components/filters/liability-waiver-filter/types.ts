import type {
  CreateLiabilityWaiverFilterPayload,
  UpdateLiabilityWaiverFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type LiabilityWaiverFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type LiabilityWaiverFilterCreatePayload =
  CreateLiabilityWaiverFilterPayload;

export type LiabilityWaiverFilterDirtyPatchPayload =
  UpdateLiabilityWaiverFilterPayload;

export type LiabilityWaiverFilterCardProps =
  SegmentFilterCardProps<LiabilityWaiverFilterFormValue>;
