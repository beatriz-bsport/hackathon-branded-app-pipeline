import type { CreditAccountFilter } from "@bsport/api-cdp/smartlist";

import {
  CREDIT_ACCOUNT_NUMBER_TYPE,
  creditAccountComparatorToTypeMap,
} from "../constants";
import type { CreditAccountFilterFormValue } from "../types";

export const mapCreditAccountFilterToFormValue = (
  filter: CreditAccountFilter,
): CreditAccountFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  type:
    creditAccountComparatorToTypeMap[filter.comparator] ??
    CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual,
  value: filter.value ?? 0,
  secondValue:
    creditAccountComparatorToTypeMap[filter.comparator] ===
    CREDIT_ACCOUNT_NUMBER_TYPE.between
      ? (filter.value_second ?? null)
      : null,
});
