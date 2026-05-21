import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { CoachSubFilterSection } from "./coach.component";
import { refineCoachSubFilter } from "./schema";

const COACH_INACTIVE_API_SLICE: Partial<CreateTotalBookingFilterPayload> = {
  coach_filter_active: false,
  select_all_coaches: true,
  coaches: [],
};

const toCoachApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.coach)) {
    return COACH_INACTIVE_API_SLICE;
  }

  return {
    coach_filter_active: true,
    select_all_coaches: value.coach.selectAllCoaches,
    coaches: value.coach.selectedCoachIds,
  };
};

const toFormCoachSection = (filter: TotalBookingFilter) => ({
  selectAllCoaches: filter.select_all_coaches,
  selectedCoachIds: filter.coaches ?? [],
});

export const coachTotalBookingSubFilterModule: TotalBookingSubFilterModule = {
  id: TOTAL_BOOKING_SUB_FILTER_IDS.coach,
  labelKey: "filters.22.subFilters.coach",
  Section: CoachSubFilterSection,
  refine: refineCoachSubFilter,
  readFromApi: (filter) => ({
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
