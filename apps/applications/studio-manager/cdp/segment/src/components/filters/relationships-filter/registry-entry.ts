import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { RelationshipsFilterCard } from "./components/relationships-filter-card";
import { createDefaultRelationshipsFilter } from "./default-value";
import { mapRelationshipsFilterToFormValue } from "./mappers/api-to-form-value";

export const relationshipsFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.relationships,
  queryDataKey: "relationsFilters",
  savedKeyPrefix: "saved-relationships",
  selector: {
    titleKey: "filters.105.title",
    descriptionKey: "filterSelector.options.relationships.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultRelationshipsFilter,
  mapToFormValue: mapRelationshipsFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      RelationshipsFilterCard,
      context.smartlistId,
      params,
    ),
});
