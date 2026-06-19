import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { LiabilityWaiverFilterCard } from "./components/liability-waiver-filter-card";
import { createDefaultLiabilityWaiverFilter } from "./default-value";
import { mapLiabilityWaiverFilterToFormValue } from "./mappers/api-to-form-value";

export const liabilityWaiverFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.liabilityWaiver,
  queryDataKey: "liabilityWaiverFilters",
  savedKeyPrefix: "saved-liability-waiver",
  selector: {
    titleKey: "filters.410.title",
    descriptionKey: "filterSelector.options.liabilityWaiver.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultLiabilityWaiverFilter,
  mapToFormValue: mapLiabilityWaiverFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      LiabilityWaiverFilterCard,
      context.smartlistId,
      params,
    ),
});
