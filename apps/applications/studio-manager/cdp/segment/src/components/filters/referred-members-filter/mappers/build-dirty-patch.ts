import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import { isReferredStatusToApi } from "../constants";
import { REGISTERED_REFERRED_MEMBERS_SUB_FILTERS } from "../sub-filters/registry";
import type {
  DirtyPatchPayload,
  ReferredMembersFilterFormValue,
} from "../types";

type ReferredMembersFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<ReferredMembersFilterFormValue>>
>;

/**
 * Builds a `PATCH /referred_members/{id}/` payload from React Hook Form dirty fields.
 */
export const buildReferredMembersFilterDirtyPatch = (
  dirtyFields: ReferredMembersFilterDirtyFields,
  value: ReferredMembersFilterFormValue,
): DirtyPatchPayload => {
  const payload: DirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.referredStatus)) {
    payload.is_referred = isReferredStatusToApi(value.referredStatus);
    if (!isReferredStatusToApi(value.referredStatus)) {
      payload.money_obtained_active = false;
    }
  }

  for (const subFilterModule of REGISTERED_REFERRED_MEMBERS_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
