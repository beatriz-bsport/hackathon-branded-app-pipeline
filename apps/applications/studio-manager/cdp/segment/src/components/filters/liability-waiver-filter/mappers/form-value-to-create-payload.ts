import type {
  LiabilityWaiverFilterCreatePayload,
  LiabilityWaiverFilterFormValue,
} from "../types";

/**
 * Builds the `POST /waiver/` payload from a form value.
 */
export const createLiabilityWaiverFilterPayload = (
  value: LiabilityWaiverFilterFormValue,
): LiabilityWaiverFilterCreatePayload => ({
  smartlist: value.smartlist,
  value: value.value,
});
