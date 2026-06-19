import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { BasketAbandonmentFilterCard } from "./components/basket-abandonment-filter-card";
import { createDefaultBasketAbandonmentFilter } from "./default-value";
import { mapBasketAbandonmentFilterToFormValue } from "./mappers/api-to-form-value";

export const basketAbandonmentFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.basketAbandonment,
  queryDataKey: "basketAbandonmentFilters",
  savedKeyPrefix: "saved-basket-abandonment",
  selector: {
    titleKey: "filters.20.title",
    descriptionKey: "filterSelector.options.basketAbandonment.description",
    category: FILTER_SELECTOR_CATEGORIES.payments,
  },
  createDefault: createDefaultBasketAbandonmentFilter,
  mapToFormValue: mapBasketAbandonmentFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      BasketAbandonmentFilterCard,
      context.smartlistId,
      params,
    ),
});
