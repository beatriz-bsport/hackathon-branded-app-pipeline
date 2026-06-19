import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { HasPhoneFilterCard } from "./components/has-phone-filter-card";
import { createDefaultHasPhoneFilter } from "./default-value";
import { mapHasPhoneFilterToFormValue } from "./mappers/api-to-form-value";

export const hasPhoneFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.hasPhone,
  queryDataKey: "hasPhoneFilters",
  savedKeyPrefix: "saved-has-phone",
  selector: {
    titleKey: "filters.106.title",
    descriptionKey: "filterSelector.options.hasPhone.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultHasPhoneFilter,
  mapToFormValue: mapHasPhoneFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(HasPhoneFilterCard, context.smartlistId, params),
});
