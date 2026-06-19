import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { PurchaseHistoryFilterCard } from "./components/purchase-history-filter-card";
import { createDefaultPurchaseHistoryFilter } from "./default-value";
import { mapPurchaseHistoryFilterToFormValue } from "./mappers/api-to-form-value";

export const purchaseHistoryFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.purchaseHistory,
  queryDataKey: "purchaseHistoryFilters",
  savedKeyPrefix: "saved-purchase-history",
  selector: {
    titleKey: "filters.24.title",
    descriptionKey: "filterSelector.options.purchaseHistory.description",
    category: FILTER_SELECTOR_CATEGORIES.payments,
  },
  createDefault: createDefaultPurchaseHistoryFilter,
  mapToFormValue: mapPurchaseHistoryFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      PurchaseHistoryFilterCard,
      context.smartlistId,
      params,
    ),
});
