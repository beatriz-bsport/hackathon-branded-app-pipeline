import type { CustomFormFilter } from "@bsport/api-cdp/smartlist";

import type { FormCompletionFilterFormValue } from "../types";
import { hasActiveDeprecatedSubFilters } from "../utils/deprecated-sub-filters";
import {
  hadLegacyConfigurationAtFetch,
  isV1CompletionFilter,
  mapV1CompletionConditionToV2,
} from "../utils/legacy-completion-condition";

/**
 * Maps a fetched custom form completion filter DTO into form state.
 */
export const mapFormCompletionFilterToFormValue = (
  filter: CustomFormFilter,
): FormCompletionFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  all_selected_must_fulfill_condition_v2: isV1CompletionFilter(filter)
    ? mapV1CompletionConditionToV2(filter)
    : filter.all_selected_must_fulfill_condition_v2,
  custom_forms: filter.custom_forms ?? [],
  hadLegacyConfigurationAtFetch: hadLegacyConfigurationAtFetch(filter),
  hadDeprecatedSubFiltersAtFetch: hasActiveDeprecatedSubFilters(filter),
});
