import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { ReferredMembersFilterCard } from "./components/referred-members-filter-card";
import { createDefaultReferredMembersFilter } from "./default-value";
import { mapReferredMemberFilterToFormValue } from "./mappers/api-to-form-value";

export const referredMembersFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.referredMembers,
  queryDataKey: "referredMemberFilters",
  savedKeyPrefix: "saved-referred-members",
  selector: {
    titleKey: "filters.30.title",
    descriptionKey: "filterSelector.options.referredMembers.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultReferredMembersFilter,
  mapToFormValue: mapReferredMemberFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      ReferredMembersFilterCard,
      context.smartlistId,
      params,
    ),
});
