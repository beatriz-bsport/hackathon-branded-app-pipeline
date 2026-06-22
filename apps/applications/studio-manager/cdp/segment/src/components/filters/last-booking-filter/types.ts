import type {
  CreateLastBookingFilterPayload,
  UpdateLastBookingFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type LastBookingFilterFormValue = {
  id?: number;
  smartlist: number;
  /** `null` on a new draft until the user enters a number of days. */
  value: number | null;
};

export type LastBookingFilterCreatePayload = CreateLastBookingFilterPayload;

export type LastBookingFilterDirtyPatchPayload = UpdateLastBookingFilterPayload;

export type LastBookingFilterCardProps =
  SegmentFilterCardProps<LastBookingFilterFormValue>;
