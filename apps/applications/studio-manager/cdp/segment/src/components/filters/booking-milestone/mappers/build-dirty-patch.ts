import type { FieldNamesMarkedBoolean } from "@bsport/form";

import type {
  BookingMilestoneDirtyPatchPayload,
  BookingMilestoneFilterFormValue,
} from "#src/components/filters/booking-milestone/types";
import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "#src/components/filters/total-booking/sub-filters/registry";

type BookingMilestoneDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<BookingMilestoneFilterFormValue>>
>;

/**
 * Builds the dirty PATCH body for the milestone filter. Reuses the shared
 * total-booking sub-filter dirty slices (their API field shapes match) and
 * adds the milestone `value` only when the user changed it.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: BookingMilestoneDirtyFields,
  value: BookingMilestoneFilterFormValue,
): BookingMilestoneDirtyPatchPayload => {
  const payload: BookingMilestoneDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
