import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { ReferrerFilterCard } from "./components/referrer-filter-card";
import { createDefaultReferrerFilter } from "./default-value";
import { mapReferrerFilterToFormValue } from "./mappers/api-to-form-value";

export const referrerFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.referrer,
  queryDataKey: "referrerFilters",
  savedKeyPrefix: "saved-referrer",
  selector: {
    titleKey: "filters.29.title",
    descriptionKey: "filterSelector.options.referrer.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultReferrerFilter,
  mapToFormValue: mapReferrerFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(ReferrerFilterCard, context.smartlistId, params),
});
