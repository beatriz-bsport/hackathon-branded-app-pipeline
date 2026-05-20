import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { EstablishmentSubFilterSection } from "./establishment.component";
import { refineEstablishmentSubFilter } from "./schema";

const ESTABLISHMENT_INACTIVE_API_SLICE: Partial<CreateTotalBookingFilterPayload> =
  {
    establishment_filter_active: false,
    select_all_establishments: true,
    establishments: [],
  };

const toEstablishmentApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.establishment)) {
    return ESTABLISHMENT_INACTIVE_API_SLICE;
  }

  return {
    establishment_filter_active: true,
    select_all_establishments: value.establishment.selectAllEstablishments,
    establishments: value.establishment.selectedEstablishmentIds,
  };
};

const toFormEstablishmentSection = (filter: TotalBookingFilter) => ({
  selectAllEstablishments: filter.select_all_establishments,
  selectedEstablishmentIds: filter.establishments,
});

export const establishmentTotalBookingSubFilterModule: TotalBookingSubFilterModule =
  {
    id: TOTAL_BOOKING_SUB_FILTER_IDS.establishment,
    labelKey: "filters.22.subFilters.establishment",
    Section: EstablishmentSubFilterSection,
    refine: refineEstablishmentSubFilter,
    readFromApi: (filter) => ({
      isActive: filter.establishment_filter_active,
      partial: {
        establishment: toFormEstablishmentSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toEstablishmentApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const establishmentDirty = hasNestedDirty(dirtyFields.establishment);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !establishmentDirty && !subFiltersTouched) {
        return {};
      }
      return toEstablishmentApiSlice(value);
    },
  };
