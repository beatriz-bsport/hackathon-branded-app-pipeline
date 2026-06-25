import type { RelationsFilter } from "@bsport/api-cdp/smartlist";

import type { RelationshipsFilterFormValue } from "../types";
import { hasActiveDeprecatedSubFilters } from "../utils/deprecated-sub-filters";

/**
 * Maps a hydrated relationships filter DTO into form state.
 */
export const mapRelationshipsFilterToFormValue = (
  filter: RelationsFilter,
): RelationshipsFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  comparator_number_relations: filter.comparator_number_relations,
  value_number_relations: filter.value_number_relations ?? 0,
  value_number_relations_second: filter.value_number_relations_second ?? 0,
  hadDeprecatedSubFiltersAtHydration: hasActiveDeprecatedSubFilters(filter),
});
