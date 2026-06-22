import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { HasPasswordFilterCard } from "./components/has-password-filter-card";
import { createDefaultHasPasswordFilter } from "./default-value";
import { mapHasPasswordFilterToFormValue } from "./mappers/api-to-form-value";

export const hasPasswordFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.hasPassword,
  queryDataKey: "hasPasswordFilters",
  savedKeyPrefix: "saved-has-password",
  selector: {
    titleKey: "filters.400.title",
    descriptionKey: "filterSelector.options.hasPassword.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultHasPasswordFilter,
  mapToFormValue: mapHasPasswordFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      HasPasswordFilterCard,
      context.smartlistId,
      params,
    ),
});
