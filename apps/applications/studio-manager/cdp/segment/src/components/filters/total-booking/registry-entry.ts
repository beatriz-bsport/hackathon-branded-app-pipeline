import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderCompanyScopedFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { TotalBookingFilterCardSkeleton } from "./components/total-booking-filter-card-skeleton";
import { TotalBookingNumberFilterCard } from "./components/total-booking-number-filter-card";
import { createDefaultTotalBookingNumberFilter } from "./default-value";
import { mapTotalBookingFilterToFormValue } from "./mappers/api-to-form-value";

export const totalBookingNumberFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalBookingNumber,
  queryDataKey: "totalBookingFilters",
  savedKeyPrefix: "saved-total-booking-number",
  selector: {
    titleKey: "filters.22.title",
    descriptionKey: "filterSelector.options.totalBookingNumber.description",
    category: FILTER_SELECTOR_CATEGORIES.bookings,
  },
  createDefault: createDefaultTotalBookingNumberFilter,
  mapToFormValue: mapTotalBookingFilterToFormValue,
  render: (context, params) =>
    renderCompanyScopedFilterCard(
      TotalBookingFilterCardSkeleton,
      TotalBookingNumberFilterCard,
      context,
      params,
    ),
});
