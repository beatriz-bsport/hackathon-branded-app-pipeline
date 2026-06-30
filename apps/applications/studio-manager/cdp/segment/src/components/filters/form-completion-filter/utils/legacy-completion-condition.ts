import {
  CUSTOM_FORM_COMPLETION_CONDITION,
  type CustomFormCompletionCondition,
  type CustomFormFilter,
} from "@bsport/api-cdp/smartlist";

import { hasActiveDeprecatedSubFilters } from "./deprecated-sub-filters";

/**
 * Older smartlists may still store completion as v1 booleans (`has_filled`,
 * `all_selected_must_fulfill_condition`) when `is_v2` is false. Studio only
 * reads and writes `all_selected_must_fulfill_condition_v2`, so fetched v1 rows
 * must be mapped into form state until the user saves (which persists `is_v2: true`).
 */
export const mapV1CompletionConditionToV2 = (
  filter: CustomFormFilter,
): CustomFormCompletionCondition => {
  if (filter.has_filled && !filter.all_selected_must_fulfill_condition) {
    return CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM;
  }

  if (filter.has_filled && filter.all_selected_must_fulfill_condition) {
    return CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS;
  }

  if (!filter.has_filled && filter.all_selected_must_fulfill_condition) {
    return CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM;
  }

  // v1-only "missing at least one" — no v2 equivalent; default until user re-saves.
  return CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM;
};

/**
 * Whether the fetched row still uses legacy v1 completion storage.
 */
export const isV1CompletionFilter = (filter: CustomFormFilter): boolean =>
  filter.is_v2 === false;

/**
 * Whether the filter needs a legacy warning (v1 completion and/or deprecated sub-filters).
 */
export const hadLegacyConfigurationAtFetch = (
  filter: CustomFormFilter,
): boolean =>
  hasActiveDeprecatedSubFilters(filter) || isV1CompletionFilter(filter);
