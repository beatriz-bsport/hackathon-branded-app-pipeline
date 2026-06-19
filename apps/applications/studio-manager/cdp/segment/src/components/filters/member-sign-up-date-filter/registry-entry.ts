import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { MemberSignUpDateFilterCard } from "./components/member-sign-up-date-filter-card";
import { createDefaultMemberSignUpDateFilter } from "./default-value";
import { mapMemberDateJoinedFilterToFormValue } from "./mappers/api-to-form-value";

export const memberSignUpDateFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.memberSignUpDate,
  queryDataKey: "memberDateJoinedFilters",
  savedKeyPrefix: "saved-member-sign-up-date",
  selector: {
    titleKey: "filters.18.title",
    descriptionKey: "filterSelector.options.memberSignUpDate.description",
    category: FILTER_SELECTOR_CATEGORIES.memberInformations,
  },
  createDefault: createDefaultMemberSignUpDateFilter,
  mapToFormValue: mapMemberDateJoinedFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      MemberSignUpDateFilterCard,
      context.smartlistId,
      params,
    ),
});
