import type {
  CreateHasPhoneFilterPayload,
  UpdateHasPhoneFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type HasPhoneFilterFormValue = {
  id?: number;
  smartlist: number;
  value: boolean;
};

export type HasPhoneFilterCreatePayload = CreateHasPhoneFilterPayload;

export type HasPhoneFilterDirtyPatchPayload = UpdateHasPhoneFilterPayload;

export type HasPhoneFilterCardProps =
  SegmentFilterCardProps<HasPhoneFilterFormValue>;
