import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderQueryBoundaryFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { FormCompletionFilterCardSkeleton } from "./components/form-completion-filter-card-skeleton";
import { FormCompletionFilterCardWithData } from "./components/form-completion-filter-card-with-data";
import { createDefaultFormCompletionFilter } from "./default-value";
import { mapFormCompletionFilterToFormValue } from "./mappers/api-to-form-value";

export const formCompletionFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.formCompletion,
  queryDataKey: "customFormFilters",
  savedKeyPrefix: "saved-form-completion",
  selector: {
    titleKey: "filters.102.title",
    descriptionKey: "filterSelector.options.formCompletion.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultFormCompletionFilter,
  mapToFormValue: mapFormCompletionFilterToFormValue,
  render: (context, params) =>
    renderQueryBoundaryFilterCard(
      FormCompletionFilterCardSkeleton,
      FormCompletionFilterCardWithData,
      context.smartlistId,
      params,
    ),
});
