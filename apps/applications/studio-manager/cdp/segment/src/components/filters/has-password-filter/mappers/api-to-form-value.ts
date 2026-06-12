import type { HasPasswordFilter } from "@bsport/api-cdp/smartlist";

import type { HasPasswordFilterFormValue } from "../types";

/**
 * Converts a server-side `HasPasswordFilter` payload into the UI form value.
 */
export const mapHasPasswordFilterToFormValue = (
  filter: HasPasswordFilter,
): HasPasswordFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value: filter.value,
});
