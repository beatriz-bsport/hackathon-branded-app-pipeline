import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderQueryBoundaryFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { AppointmentPassFilterCardSkeleton } from "./components/appointment-pass-filter-card-skeleton";
import { AppointmentPassFilterCardWithData } from "./components/appointment-pass-filter-card-with-data";
import { createDefaultAppointmentPassFilter } from "./default-value";
import { mapPrivatePassFilterToFormValue } from "./mappers/api-to-form-value";

export const appointmentPassFilterRegistryEntry = defineSegmentFilterEntry({
  filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.appointmentPass,
  queryDataKey: "privatePassFilters",
  savedKeyPrefix: "saved-appointment-pass",
  selector: {
    titleKey: "filters.25.title",
    descriptionKey: "filterSelector.options.appointmentPass.description",
    category: FILTER_SELECTOR_CATEGORIES.passes,
  },
  createDefault: createDefaultAppointmentPassFilter,
  mapToFormValue: mapPrivatePassFilterToFormValue,
  render: (context, params) =>
    renderQueryBoundaryFilterCard(
      AppointmentPassFilterCardSkeleton,
      AppointmentPassFilterCardWithData,
      context.smartlistId,
      params,
    ),
});
