import type {
  HasPhoneFilterCreatePayload,
  HasPhoneFilterFormValue,
} from "../types";

/**
 * Builds the `POST /has_phone/` payload from a form value.
 */
export const createHasPhoneFilterPayload = (
  value: HasPhoneFilterFormValue,
): HasPhoneFilterCreatePayload => ({
  smartlist: value.smartlist,
  value: value.value,
});
