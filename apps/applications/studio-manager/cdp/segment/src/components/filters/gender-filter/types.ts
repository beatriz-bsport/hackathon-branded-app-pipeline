import type {
  CreateGenderFilterPayload,
  UpdateGenderFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";
import type { GenderOption } from "./constants";

export type GenderFilterFormValue = {
  id?: number;
  smartlist: number;
  value: GenderOption;
};

export type GenderFilterCreatePayload = CreateGenderFilterPayload;

export type GenderFilterDirtyPatchPayload = UpdateGenderFilterPayload;

export type GenderFilterCardProps =
  SegmentFilterCardProps<GenderFilterFormValue>;
