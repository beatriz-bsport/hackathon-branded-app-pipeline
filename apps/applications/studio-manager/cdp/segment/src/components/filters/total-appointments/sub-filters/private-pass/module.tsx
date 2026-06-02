import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { PrivatePassSubFilterSection } from "./component";
import { refinePrivatePassSubFilter } from "./schema";

const PRIVATE_PASS_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> =
  {
    private_pass_filter_active: false,
    select_all_private_passes: true,
    private_passes: [],
  };

const toPrivatePassApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass)
  ) {
    return PRIVATE_PASS_INACTIVE_API_SLICE;
  }

  return {
    private_pass_filter_active: true,
    select_all_private_passes: value.privatePass.selectAllPrivatePasses,
    private_passes: value.privatePass.selectedPrivatePassIds,
  };
};

const toFormPrivatePassSection = (filter: PrivateBookingsFilter) => ({
  selectAllPrivatePasses: filter.select_all_private_passes,
  selectedPrivatePassIds: filter.private_passes ?? [],
});

export const privatePassTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass,
    labelKey: "filters.26.subFilters.appointmentPass",
    Section: PrivatePassSubFilterSection,
    refine: refinePrivatePassSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
      isActive: filter.private_pass_filter_active,
      partial: {
        privatePass: toFormPrivatePassSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toPrivatePassApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const privatePassDirty = hasNestedDirty(dirtyFields.privatePass);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !privatePassDirty && !subFiltersTouched) {
        return {};
      }
      return toPrivatePassApiSlice(value);
    },
  };
