import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderCompanyScopedFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { TotalAppointmentsFilterCardSkeleton } from "./components/total-appointments-filter-card-skeleton";
import { TotalAppointmentsNumberFilterCard } from "./components/total-appointments-number-filter-card";
import { createDefaultTotalAppointmentsNumberFilter } from "./default-value";
import { mapTotalAppointmentsFilterToFormValue } from "./mappers/api-to-form-value";

export const totalAppointmentsNumberFilterRegistryEntry =
  defineSegmentFilterEntry({
    filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalAppointmentsNumber,
    queryDataKey: "totalAppointmentsFilters",
    savedKeyPrefix: "saved-total-appointments-number",
    selector: {
      titleKey: "filters.26.title",
      descriptionKey:
        "filterSelector.options.totalAppointmentsNumber.description",
      category: FILTER_SELECTOR_CATEGORIES.bookings,
    },
    createDefault: createDefaultTotalAppointmentsNumberFilter,
    mapToFormValue: mapTotalAppointmentsFilterToFormValue,
    render: (context, params) =>
      renderCompanyScopedFilterCard(
        TotalAppointmentsFilterCardSkeleton,
        TotalAppointmentsNumberFilterCard,
        context,
        params,
      ),
  });
