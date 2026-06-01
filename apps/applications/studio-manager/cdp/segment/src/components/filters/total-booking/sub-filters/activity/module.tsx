import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { ActivitySubFilterSection } from "./component";
import { refineActivitySubFilter } from "./schema";

const ACTIVITY_INACTIVE_API_SLICE: Partial<CreateTotalBookingFilterPayload> = {
  activity_filter_active: false,
  select_all_activities: true,
  meta_activities: [],
};

const toActivityApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.activity)) {
    return ACTIVITY_INACTIVE_API_SLICE;
  }

  return {
    activity_filter_active: true,
    select_all_activities: value.activity.selectAllActivities,
    meta_activities: value.activity.selectedMetaActivityIds,
  };
};

const toFormActivitySection = (filter: TotalBookingFilter) => ({
  selectAllActivities: filter.select_all_activities,
  selectedMetaActivityIds: filter.meta_activities,
});

export const activityTotalBookingSubFilterModule: TotalBookingSubFilterModule =
  {
    id: TOTAL_BOOKING_SUB_FILTER_IDS.activity,
    labelKey: "filters.22.subFilters.activity",
    Section: ActivitySubFilterSection,
    refine: refineActivitySubFilter,
    readFromApi: (filter) => ({
      isActive: filter.activity_filter_active,
      partial: {
        activity: toFormActivitySection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toActivityApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const activityDirty = hasNestedDirty(dirtyFields.activity);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !activityDirty && !subFiltersTouched) {
        return {};
      }
      return toActivityApiSlice(value);
    },
  };
