import type {
  LastBookingFilterCreatePayload,
  LastBookingFilterFormValue,
} from "../types";

/**
 * Builds the `POST /last_booking/` payload from a validated form value.
 */
export const createLastBookingFilterPayload = (
  value: LastBookingFilterFormValue,
): LastBookingFilterCreatePayload => {
  if (value.value === null) {
    throw new Error("Cannot create last booking filter without a value.");
  }

  return {
    smartlist: value.smartlist,
    value: value.value,
  };
};
