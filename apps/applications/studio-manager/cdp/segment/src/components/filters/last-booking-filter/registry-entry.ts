import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { LastBookingFilterCard } from "./components/last-booking-filter-card";
import { createDefaultLastBookingFilter } from "./default-value";
import { mapLastBookingFilterToFormValue } from "./mappers/api-to-form-value";

export const lastBookingFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.lastBooking,
  queryDataKey: "lastBookingFilters",
  savedKeyPrefix: "saved-last-booking",
  selector: {
    titleKey: "filters.501.title",
    descriptionKey: "filterSelector.options.lastBooking.description",
    category: FILTER_SELECTOR_CATEGORIES.bookings,
  },
  createDefault: createDefaultLastBookingFilter,
  mapToFormValue: mapLastBookingFilterToFormValue,
  render: (context, params) =>
    renderStandardFilterCard(
      LastBookingFilterCard,
      context.smartlistId,
      params,
    ),
});
