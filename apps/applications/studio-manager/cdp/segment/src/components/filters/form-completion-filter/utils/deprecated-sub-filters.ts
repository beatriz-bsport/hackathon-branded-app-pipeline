import type { CustomFormFilter } from "@bsport/api-cdp/smartlist";

/**
 * Returns whether any deprecated legacy sub-filter is active on the API row.
 */
export const hasActiveDeprecatedSubFilters = (
  filter: CustomFormFilter,
): boolean =>
  filter.date_filter_active || filter.completion_percentage_filter_active;

/**
 * Builds a PATCH body that deactivates all deprecated sub-filters.
 */
export const buildDeactivateDeprecatedSubFiltersPatch = () => ({
  date_filter_active: false,
  completion_percentage_filter_active: false,
});
