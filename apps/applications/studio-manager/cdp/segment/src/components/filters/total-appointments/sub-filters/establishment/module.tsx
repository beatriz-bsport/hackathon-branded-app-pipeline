import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { EstablishmentSubFilterSection } from "./component";
import { refineEstablishmentSubFilter } from "./schema";

const ESTABLISHMENT_INACTIVE_API_SLICE =
  (): Partial<CreatePrivateBookingsFilterPayload> => ({
    establishment_filter_active: false,
    select_all_establishments: true,
    establishments: [],
    at_home: false,
  });

const toEstablishmentApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment)
  ) {
    return ESTABLISHMENT_INACTIVE_API_SLICE();
  }

  return {
    establishment_filter_active: true,
    select_all_establishments: value.establishment.selectAllEstablishments,
    establishments: value.establishment.selectedEstablishmentIds,
    at_home: value.establishment.atHome,
  };
};

const toFormEstablishmentSection = (filter: PrivateBookingsFilter) => ({
  selectAllEstablishments: filter.select_all_establishments,
  selectedEstablishmentIds: filter.establishments ?? [],
  atHome: filter.at_home,
});

export const establishmentTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment,
    labelKey: "filters.26.subFilters.establishment",
    Section: EstablishmentSubFilterSection,
    refine: refineEstablishmentSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
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
