import { SmartlistCreditAccountFilterComparator } from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const CREDIT_ACCOUNT_NUMBER_TYPE = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type CreditAccountNumberTypeValue =
  (typeof CREDIT_ACCOUNT_NUMBER_TYPE)[keyof typeof CREDIT_ACCOUNT_NUMBER_TYPE];

export const isCreditAccountNumberType = (
  operator: NumericComparatorOperator,
): operator is CreditAccountNumberTypeValue =>
  operator === CREDIT_ACCOUNT_NUMBER_TYPE.between ||
  operator === CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual ||
  operator === CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual ||
  operator === CREDIT_ACCOUNT_NUMBER_TYPE.equal;

export const creditAccountNumberTypeToComparatorMap = {
  [CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual]:
    SmartlistCreditAccountFilterComparator.LTE,
  [CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual]:
    SmartlistCreditAccountFilterComparator.GTE,
  [CREDIT_ACCOUNT_NUMBER_TYPE.equal]:
    SmartlistCreditAccountFilterComparator.EQUAL,
  [CREDIT_ACCOUNT_NUMBER_TYPE.between]:
    SmartlistCreditAccountFilterComparator.BETWEEN,
} as const;

export const creditAccountComparatorToTypeMap: Record<
  SmartlistCreditAccountFilterComparator,
  CreditAccountNumberTypeValue
> = {
  [SmartlistCreditAccountFilterComparator.LTE]:
    CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual,
  [SmartlistCreditAccountFilterComparator.GTE]:
    CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual,
  // Not used in the segment UI, but the backend defines it
  [SmartlistCreditAccountFilterComparator.LT]:
    CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual,
  // Not used in the segment UI, but the backend defines it
  [SmartlistCreditAccountFilterComparator.GT]:
    CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual,
  [SmartlistCreditAccountFilterComparator.EQUAL]:
    CREDIT_ACCOUNT_NUMBER_TYPE.equal,
  [SmartlistCreditAccountFilterComparator.BETWEEN]:
    CREDIT_ACCOUNT_NUMBER_TYPE.between,
};
