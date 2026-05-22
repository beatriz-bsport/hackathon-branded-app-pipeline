import type { GenderFilterCreatePayload } from "../types";
import type { GenderFilterFormValue } from "../types";

/**
 * Builds the `POST /gender_filter/` payload from a form value.
 */
export const createGenderFilterPayload = (
  value: GenderFilterFormValue,
): GenderFilterCreatePayload => ({
  smartlist: value.smartlist,
  value: value.value,
});
