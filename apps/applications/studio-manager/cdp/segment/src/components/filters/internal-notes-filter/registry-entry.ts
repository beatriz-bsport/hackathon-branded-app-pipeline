import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { InternalNotesFilterCard } from "./components/internal-notes-filter-card";
import { createDefaultInternalNotesFilter } from "./default-value";
import { mapInternalNotesFilterToFormValue } from "./mappers/api-to-form-value";

export const internalNotesFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.internalNotes,
  queryDataKey: "internalNotesFilters",
  savedKeyPrefix: "saved-internal-notes",
  selector: {
    titleKey: "filters.104.title",
    descriptionKey: "filterSelector.options.internalNotes.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultInternalNotesFilter,
  mapToFormValue: mapInternalNotesFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      InternalNotesFilterCard,
      context.smartlistId,
      params,
    ),
});
