import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { TermsAndConditionsFilterCard } from "./components/terms-and-conditions-filter-card";
import { createDefaultTermsAndConditionsFilter } from "./default-value";
import { mapTermsAndConditionsFilterToFormValue } from "./mappers/api-to-form-value";

export const termsAndConditionsFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.termsAndConditions,
  queryDataKey: "termsAndConditionsFilters",
  savedKeyPrefix: "saved-terms-and-conditions",
  selector: {
    titleKey: "filters.107.title",
    descriptionKey: "filterSelector.options.termsAndConditions.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultTermsAndConditionsFilter,
  mapToFormValue: mapTermsAndConditionsFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      TermsAndConditionsFilterCard,
      context.smartlistId,
      params,
    ),
});
