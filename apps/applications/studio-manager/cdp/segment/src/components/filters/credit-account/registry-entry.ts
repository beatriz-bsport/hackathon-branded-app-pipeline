import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { CreditAccountFilterCard } from "./components/credit-account-filter-card";
import { createDefaultCreditAccountFilter } from "./default-value";
import { mapCreditAccountFilterToFormValue } from "./mappers/api-to-form-value";

export const creditAccountFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.creditAccount,
  queryDataKey: "creditAccountFilters",
  savedKeyPrefix: "saved-credit-account",
  selector: {
    titleKey: "filters.1.title",
    descriptionKey: "filterSelector.options.creditAccount.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultCreditAccountFilter,
  mapToFormValue: mapCreditAccountFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      CreditAccountFilterCard,
      context.smartlistId,
      params,
    ),
});
