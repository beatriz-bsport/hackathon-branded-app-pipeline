import type { z } from "zod";

import type { TotalBookingNumberFilterFormValue } from "../../types";

/**
 * No extra cross-field rules beyond the base form schema; when this sub-filter
 * is selected, `attendanceMode.attendance` is a required boolean (`zod`).
 */
export const refineAttendanceModeSubFilter = (
  _value: TotalBookingNumberFilterFormValue,
  _context: z.RefinementCtx,
) => {};
