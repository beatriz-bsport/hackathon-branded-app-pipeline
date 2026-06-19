import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { AgeFilterCard } from "./components/age-filter-card";
import { createDefaultAgeFilter } from "./default-value";
import { mapAgeFilterToFormValue } from "./mappers/api-to-form-value";

export const ageFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.age,
  queryDataKey: "ageFilters",
  savedKeyPrefix: "saved-age",
  selector: {
    titleKey: "filters.101.title",
    descriptionKey: "filterSelector.options.age.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultAgeFilter,
  mapToFormValue: mapAgeFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(AgeFilterCard, context.smartlistId, params),
});
