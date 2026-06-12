import type {
  HasPasswordFilterCreatePayload,
  HasPasswordFilterFormValue,
} from "../types";

/**
 * Builds the `POST /has_password/` payload from a form value.
 */
export const createHasPasswordFilterPayload = (
  value: HasPasswordFilterFormValue,
): HasPasswordFilterCreatePayload => ({
  smartlist: value.smartlist,
  value: value.value,
});
