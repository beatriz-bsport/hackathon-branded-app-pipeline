import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderQueryBoundaryFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { PassesFilterCardSkeleton } from "./components/passes-filter-card-skeleton";
import { PassesFilterCardWithData } from "./components/passes-filter-card-with-data";
import { createDefaultPassesFilter } from "./default-value";
import { mapApiFilterToFormValue as mapPaymentPackFilterToFormValue } from "./mappers/api-to-form-value";

export const passesFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.passes,
  queryDataKey: "paymentPackFilters",
  savedKeyPrefix: "saved-passes",
  selector: {
    titleKey: "filters.19.title",
    descriptionKey: "filterSelector.options.passes.description",
    category: FILTER_SELECTOR_CATEGORIES.passes,
  },
  createDefault: createDefaultPassesFilter,
  mapToFormValue: mapPaymentPackFilterToFormValue,
  render: (context, params) =>
    renderQueryBoundaryFilterCard(
      PassesFilterCardSkeleton,
      PassesFilterCardWithData,
      context.smartlistId,
      params,
    ),
});
