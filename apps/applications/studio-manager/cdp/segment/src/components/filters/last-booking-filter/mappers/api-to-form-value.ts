import type { LastBookingFilter } from "@bsport/api-cdp/smartlist";

import type { LastBookingFilterFormValue } from "../types";

/**
 * Converts a server-side `LastBookingFilter` payload into the UI form value.
 */
export const mapLastBookingFilterToFormValue = (
  filter: LastBookingFilter,
): LastBookingFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value: filter.value,
});
