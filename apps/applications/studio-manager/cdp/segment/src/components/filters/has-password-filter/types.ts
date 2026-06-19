import type {
  CreateHasPasswordFilterPayload,
  UpdateHasPasswordFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type HasPasswordFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type HasPasswordFilterCreatePayload = CreateHasPasswordFilterPayload;

export type HasPasswordFilterDirtyPatchPayload = UpdateHasPasswordFilterPayload;

export type HasPasswordFilterCardProps =
  SegmentFilterCardProps<HasPasswordFilterFormValue>;
