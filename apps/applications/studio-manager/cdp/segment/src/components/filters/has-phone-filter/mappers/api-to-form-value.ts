import type { HasPhoneFilter } from "@bsport/api-cdp/smartlist";

import type { HasPhoneFilterFormValue } from "../types";

/**
 * Converts a server-side `HasPhoneFilter` payload into the UI form value.
 */
export const mapHasPhoneFilterToFormValue = (
  filter: HasPhoneFilter,
): HasPhoneFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value: filter.value,
});
