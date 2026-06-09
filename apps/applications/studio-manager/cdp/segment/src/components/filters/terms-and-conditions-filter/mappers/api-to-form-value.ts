import type { TermsAndConditionsFilter } from "@bsport/api-cdp/smartlist";

import type { TermsAndConditionsFilterFormValue } from "../types";

/**
 * Converts a server-side `TermsAndConditionsFilter` payload into the UI form value.
 */
export const mapTermsAndConditionsFilterToFormValue = (
  filter: TermsAndConditionsFilter,
): TermsAndConditionsFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value: filter.value,
});
