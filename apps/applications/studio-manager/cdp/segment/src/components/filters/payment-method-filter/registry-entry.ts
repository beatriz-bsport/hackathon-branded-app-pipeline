import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { PaymentMethodFilterCard } from "./components/payment-method-filter-card";
import { createDefaultPaymentMethodFilter } from "./default-value";
import { mapPaymentMethodFilterToFormValue } from "./mappers/api-to-form-value";

export const paymentMethodFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.paymentMethod,
  queryDataKey: "paymentMethodFilters",
  savedKeyPrefix: "saved-payment-method",
  selector: {
    titleKey: "filters.600.title",
    descriptionKey: "filterSelector.options.paymentMethod.description",
    category: FILTER_SELECTOR_CATEGORIES.payments,
  },
  createDefault: createDefaultPaymentMethodFilter,
  mapToFormValue: mapPaymentMethodFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      PaymentMethodFilterCard,
      context.smartlistId,
      params,
    ),
});
