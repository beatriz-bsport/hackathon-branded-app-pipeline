import type {
  MemberSignUpDateFilterCreatePayload,
  MemberSignUpDateFilterFormValue,
} from "../types";
import { mapSignUpDateToApiFields } from "./date-fields-to-api";

/**
 * Builds the POST body for a new member sign-up date filter.
 */
export const toCreatePayload = (
  value: MemberSignUpDateFilterFormValue,
): MemberSignUpDateFilterCreatePayload => {
  const dateFields = mapSignUpDateToApiFields(value.signUpDate);

  return {
    smartlist: value.smartlist,
    ...dateFields,
  };
};
