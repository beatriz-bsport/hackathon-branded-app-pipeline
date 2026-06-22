import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderQueryBoundaryFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { ActivePassesFilterCard } from "./components/active-passes-filter-card";
import { ActivePassesFilterCardSkeleton } from "./components/active-passes-filter-card-skeleton";
import { createDefaultActivePassesFilter } from "./default-value";
import { mapActivePassesFilterToFormValue } from "./mappers/api-to-form-value";

export const activePassesFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.activePasses,
  queryDataKey: "activePassesFilters",
  savedKeyPrefix: "saved-active-passes",
  selector: {
    titleKey: "filters.27.title",
    descriptionKey: "filterSelector.options.activePasses.description",
    category: FILTER_SELECTOR_CATEGORIES.passes,
  },
  createDefault: createDefaultActivePassesFilter,
  mapToFormValue: mapActivePassesFilterToFormValue,
  render: (context, params) =>
    renderQueryBoundaryFilterCard(
      ActivePassesFilterCardSkeleton,
      ActivePassesFilterCard,
      context.smartlistId,
      params,
    ),
});
