import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type {
  MemberSignUpDateDirtyPatchPayload,
  MemberSignUpDateFilterFormValue,
} from "../types";
import { mapSignUpDateToApiFields } from "./date-fields-to-api";

type MemberSignUpDateFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<MemberSignUpDateFilterFormValue>>
>;

/**
 * Builds a PATCH payload from React Hook Form dirty fields (dirty-only contract).
 */
export const buildDirtyPatchPayload = (
  dirtyFields: MemberSignUpDateFilterDirtyFields,
  value: MemberSignUpDateFilterFormValue,
): MemberSignUpDateDirtyPatchPayload => {
  if (!hasNestedDirty(dirtyFields.signUpDate)) {
    return {};
  }

  return mapSignUpDateToApiFields(value.signUpDate);
};
