import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { CoachSubFilterSection } from "./coach.component";
import { refineCoachSubFilter } from "./schema";

const COACH_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> = {
  coach_filter_active: false,
  select_all_coaches: true,
  coaches: [],
};

const toCoachApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach)) {
    return COACH_INACTIVE_API_SLICE;
  }

  return {
    coach_filter_active: true,
    select_all_coaches: value.coach.selectAllCoaches,
    coaches: value.coach.selectedCoachIds,
  };
};

const toFormCoachSection = (filter: PrivateBookingsFilter) => ({
  selectAllCoaches: filter.select_all_coaches,
  selectedCoachIds: filter.coaches ?? [],
});

export const coachTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach,
    labelKey: "filters.26.subFilters.coach",
    Section: CoachSubFilterSection,
    refine: refineCoachSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
      isActive: filter.coach_filter_active,
      partial: {
        coach: toFormCoachSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toCoachApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const coachDirty = hasNestedDirty(dirtyFields.coach);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !coachDirty && !subFiltersTouched) {
        return {};
      }
      return toCoachApiSlice(value);
    },
  };
