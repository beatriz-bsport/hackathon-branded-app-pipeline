import type { GenderFilter } from "@bsport/api-cdp/smartlist";

import { GENDER_OPTIONS } from "../constants";
import type { GenderFilterFormValue } from "../types";

/**
 * Converts a server-side `GenderFilter` payload into the UI form value.
 */
export const mapGenderFilterToFormValue = (
  filter: GenderFilter,
): GenderFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  value:
    filter.value === GENDER_OPTIONS.female
      ? GENDER_OPTIONS.female
      : GENDER_OPTIONS.male,
});
