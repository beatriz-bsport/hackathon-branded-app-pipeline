import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { FirstPurchaseFilterCard } from "./components/first-purchase-filter-card";
import { createDefaultFirstPurchaseFilter } from "./default-value";
import { mapFirstPurchaseFilterToFormValue } from "./mappers/api-to-form-value";

export const firstPurchaseFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.firstPurchase,
  queryDataKey: "firstPurchaseFilters",
  savedKeyPrefix: "saved-first-purchase",
  selector: {
    titleKey: "filters.28.title",
    descriptionKey: "filterSelector.options.firstPurchase.description",
    category: FILTER_SELECTOR_CATEGORIES.payments,
  },
  createDefault: createDefaultFirstPurchaseFilter,
  mapToFormValue: mapFirstPurchaseFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      FirstPurchaseFilterCard,
      context.smartlistId,
      params,
    ),
});
