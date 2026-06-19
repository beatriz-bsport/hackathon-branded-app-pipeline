import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderQueryBoundaryFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { TagFilterCard } from "./components/tag-filter-card";
import { TagFilterCardSkeleton } from "./components/tag-filter-card-skeleton";
import { createDefaultTagFilterFormValue } from "./default-value";
import { mapTagFilterToFormValue } from "./mappers/api-to-form-value";

export const tagFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.tags,
  queryDataKey: "tagFilters",
  savedKeyPrefix: "saved-tags",
  selector: {
    titleKey: "filters.11.title",
    descriptionKey: "filterSelector.options.tags.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultTagFilterFormValue,
  mapToFormValue: mapTagFilterToFormValue,
  render: (context, params) =>
    renderQueryBoundaryFilterCard(
      TagFilterCardSkeleton,
      TagFilterCard,
      context.smartlistId,
      params,
    ),
});
