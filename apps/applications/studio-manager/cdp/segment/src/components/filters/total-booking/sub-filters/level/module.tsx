import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { LevelSubFilterSection } from "./component";
import { refineLevelSubFilter } from "./schema";

const LEVEL_INACTIVE_API_SLICE: Partial<CreateTotalBookingFilterPayload> = {
  level_filter_active: false,
  level: [],
};

const toLevelApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.level)) {
    return LEVEL_INACTIVE_API_SLICE;
  }

  return {
    level_filter_active: true,
    level: value.level.selectedLevelIds,
  };
};

const toFormLevelSection = (filter: TotalBookingFilter) => ({
  selectedLevelIds: filter.level ?? [],
});

export const levelTotalBookingSubFilterModule: TotalBookingSubFilterModule = {
  id: TOTAL_BOOKING_SUB_FILTER_IDS.level,
  labelKey: "filters.22.subFilters.level",
  Section: LevelSubFilterSection,
  refine: refineLevelSubFilter,
  readFromApi: (filter) => ({
    isActive: filter.level_filter_active,
    partial: {
      level: toFormLevelSection(filter),
    },
  }),
  appendCreatePayloadSlice: (value) => toLevelApiSlice(value),
  appendDirtyPatchSlice: (dirtyFields, value) => {
    const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
    const levelDirty = hasNestedDirty(dirtyFields.level);
    const subFiltersTouched = dirtyFields.subFilters !== undefined;
    if (!subFiltersDirty && !levelDirty && !subFiltersTouched) {
      return {};
    }
    return toLevelApiSlice(value);
  },
};
