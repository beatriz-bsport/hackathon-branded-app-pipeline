import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { GenderFilterCard } from "./components/gender-filter-card";
import { createDefaultGenderFilter } from "./default-value";
import { mapGenderFilterToFormValue } from "./mappers/api-to-form-value";

export const genderFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.gender,
  queryDataKey: "genderFilters",
  savedKeyPrefix: "saved-gender",
  selector: {
    titleKey: "filters.5.title",
    descriptionKey: "filterSelector.options.gender.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultGenderFilter,
  mapToFormValue: mapGenderFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(GenderFilterCard, context.smartlistId, params),
});
