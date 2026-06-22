import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderCompanyScopedFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { BookingMilestoneFilterCard } from "./components/booking-milestone-filter-card";
import { BookingMilestoneFilterCardSkeleton } from "./components/booking-milestone-filter-card-skeleton";
import { createDefaultBookingMilestoneFilter } from "./default-value";
import { mapBookingMilestoneFilterToFormValue } from "./mappers/api-to-form-value";

export const bookingMilestoneFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.bookingMilestone,
  queryDataKey: "bookingMilestoneFilters",
  savedKeyPrefix: "saved-booking-milestone",
  selector: {
    titleKey: "filters.21.title",
    descriptionKey: "filterSelector.options.bookingMilestone.description",
    category: FILTER_SELECTOR_CATEGORIES.bookings,
  },
  createDefault: createDefaultBookingMilestoneFilter,
  mapToFormValue: mapBookingMilestoneFilterToFormValue,
  render: (context, params) =>
    renderCompanyScopedFilterCard(
      BookingMilestoneFilterCardSkeleton,
      BookingMilestoneFilterCard,
      context,
      params,
    ),
});
