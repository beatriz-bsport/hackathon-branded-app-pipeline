import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import {
  CREDIT_ACCOUNT_NUMBER_TYPE,
  creditAccountNumberTypeToComparatorMap,
} from "../constants";
import type {
  CreditAccountFilterDirtyPatchPayload,
  CreditAccountFilterFormValue,
} from "../types";

export type CreditAccountFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<CreditAccountFilterFormValue>>
>;

export const buildCreditAccountFilterDirtyPatch = (
  dirtyFields: CreditAccountFilterDirtyFields,
  value: CreditAccountFilterFormValue,
): CreditAccountFilterDirtyPatchPayload => {
  const payload: CreditAccountFilterDirtyPatchPayload = {};

  if (
    isDirtyFieldEntry(dirtyFields.value) ||
    isDirtyFieldEntry(dirtyFields.type) ||
    isDirtyFieldEntry(dirtyFields.secondValue)
  ) {
    payload.comparator = creditAccountNumberTypeToComparatorMap[value.type];
    payload.value = value.value;
    payload.value_second =
      value.type === CREDIT_ACCOUNT_NUMBER_TYPE.between
        ? (value.secondValue ?? value.value)
        : 0;
  }

  return payload;
};
