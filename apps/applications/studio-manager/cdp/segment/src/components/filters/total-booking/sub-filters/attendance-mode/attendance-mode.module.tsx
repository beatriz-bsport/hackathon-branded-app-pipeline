import {
  type CreateTotalBookingFilterPayload,
  type TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { AttendanceModeSubFilterSection } from "./attendance-mode.component";
import { refineAttendanceModeSubFilter } from "./schema";

const ATTENDANCE_MODE_INACTIVE_API_SLICE =
  (): Partial<CreateTotalBookingFilterPayload> => ({
    attendance_filter_active: false,
    attendance: null,
  });

const toAttendanceModeApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.attendanceMode)) {
    return ATTENDANCE_MODE_INACTIVE_API_SLICE();
  }

  return {
    attendance_filter_active: true,
    attendance: value.attendanceMode.attendance,
  };
};

const toFormAttendanceModeSection = (filter: TotalBookingFilter) => ({
  attendance: filter.attendance === false ? false : true,
});

export const attendanceModeTotalBookingSubFilterModule: TotalBookingSubFilterModule =
  {
    id: TOTAL_BOOKING_SUB_FILTER_IDS.attendanceMode,
    labelKey: "filters.22.subFilters.attendanceMode",
    Section: AttendanceModeSubFilterSection,
    refine: refineAttendanceModeSubFilter,
    readFromApi: (filter: TotalBookingFilter) => ({
      isActive: filter.attendance_filter_active === true,
      partial: {
        attendanceMode: toFormAttendanceModeSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toAttendanceModeApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const attendanceModeDirty = hasNestedDirty(dirtyFields.attendanceMode);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !attendanceModeDirty && !subFiltersTouched) {
        return {};
      }
      return toAttendanceModeApiSlice(value);
    },
  };
