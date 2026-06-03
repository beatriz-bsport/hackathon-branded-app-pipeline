import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { AppointmentPassSubFilterSection } from "./component";
import { refineAppointmentPassSubFilter } from "./schema";

const APPOINTMENT_PASS_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> =
  {
    private_pass_filter_active: false,
    select_all_private_passes: true,
    private_passes: [],
  };

const toAppointmentPassApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass,
    )
  ) {
    return APPOINTMENT_PASS_INACTIVE_API_SLICE;
  }

  return {
    private_pass_filter_active: true,
    select_all_private_passes: value.appointmentPass.selectAllAppointmentPasses,
    private_passes: value.appointmentPass.selectedAppointmentPassIds,
  };
};

const toFormAppointmentPassSection = (filter: PrivateBookingsFilter) => ({
  selectAllAppointmentPasses: filter.select_all_private_passes,
  selectedAppointmentPassIds: filter.private_passes ?? [],
});

export const appointmentPassTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass,
    labelKey: "filters.26.subFilters.appointmentPass",
    Section: AppointmentPassSubFilterSection,
    refine: refineAppointmentPassSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
      isActive: filter.private_pass_filter_active,
      partial: {
        appointmentPass: toFormAppointmentPassSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toAppointmentPassApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const appointmentPassDirty = hasNestedDirty(dirtyFields.appointmentPass);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !appointmentPassDirty && !subFiltersTouched) {
        return {};
      }
      return toAppointmentPassApiSlice(value);
    },
  };
