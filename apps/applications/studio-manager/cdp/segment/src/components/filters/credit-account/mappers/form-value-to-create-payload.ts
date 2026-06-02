import {
  CREDIT_ACCOUNT_NUMBER_TYPE,
  creditAccountNumberTypeToComparatorMap,
} from "../constants";
import type {
  CreditAccountFilterCreatePayload,
  CreditAccountFilterFormValue,
} from "../types";

export const toCreatePayload = (
  value: CreditAccountFilterFormValue,
): CreditAccountFilterCreatePayload => ({
  smartlist: value.smartlist,
  comparator: creditAccountNumberTypeToComparatorMap[value.type],
  value: value.value,
  value_second:
    value.type === CREDIT_ACCOUNT_NUMBER_TYPE.between
      ? (value.secondValue ?? value.value)
      : 0,
});
