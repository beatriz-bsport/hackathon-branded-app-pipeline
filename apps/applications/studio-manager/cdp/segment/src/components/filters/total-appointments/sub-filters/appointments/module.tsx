import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { AppointmentsSubFilterSection } from "./component";
import { refineAppointmentsSubFilter } from "./schema";

const APPOINTMENTS_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> =
  {
    private_service_filter_active: false,
    select_all_private_services: true,
    private_services: [],
  };

const toAppointmentsApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment)
  ) {
    return APPOINTMENTS_INACTIVE_API_SLICE;
  }

  return {
    private_service_filter_active: true,
    select_all_private_services: value.appointment.selectAllAppointments,
    private_services: value.appointment.selectedAppointmentIds,
  };
};

const toFormAppointmentsSection = (filter: PrivateBookingsFilter) => ({
  selectAllAppointments: filter.select_all_private_services,
  selectedAppointmentIds: filter.private_services ?? [],
});

export const appointmentsTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment,
    labelKey: "filters.26.subFilters.appointment",
    Section: AppointmentsSubFilterSection,
    refine: refineAppointmentsSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
      isActive: filter.private_service_filter_active,
      partial: {
        appointment: toFormAppointmentsSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toAppointmentsApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const appointmentDirty = hasNestedDirty(dirtyFields.appointment);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !appointmentDirty && !subFiltersTouched) {
        return {};
      }
      return toAppointmentsApiSlice(value);
    },
  };
