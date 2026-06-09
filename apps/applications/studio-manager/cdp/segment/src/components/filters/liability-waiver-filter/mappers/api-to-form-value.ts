import type { LiabilityWaiverFilter } from "@bsport/api-cdp/smartlist";

import type { LiabilityWaiverFilterFormValue } from "../types";

/**
 * Converts a server-side `LiabilityWaiverFilter` payload into the UI form value.
 */
export const mapLiabilityWaiverFilterToFormValue = (
  filter: LiabilityWaiverFilter,
): LiabilityWaiverFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value: filter.value,
});
