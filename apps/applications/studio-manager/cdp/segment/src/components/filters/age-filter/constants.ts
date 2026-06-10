import { AgeFilterComparator } from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const AGE_FILTER_NUMBER_TYPE = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type AgeFilterNumberTypeValue =
  (typeof AGE_FILTER_NUMBER_TYPE)[keyof typeof AGE_FILTER_NUMBER_TYPE];

export const isAgeFilterNumberType = (
  operator: NumericComparatorOperator,
): operator is AgeFilterNumberTypeValue =>
  operator === AGE_FILTER_NUMBER_TYPE.between ||
  operator === AGE_FILTER_NUMBER_TYPE.lowerOrEqual ||
  operator === AGE_FILTER_NUMBER_TYPE.greaterOrEqual ||
  operator === AGE_FILTER_NUMBER_TYPE.equal;

export const ageFilterNumberTypeToComparatorMap = {
  [AGE_FILTER_NUMBER_TYPE.lowerOrEqual]: AgeFilterComparator.LTE,
  [AGE_FILTER_NUMBER_TYPE.greaterOrEqual]: AgeFilterComparator.GTE,
  [AGE_FILTER_NUMBER_TYPE.equal]: AgeFilterComparator.EQUAL,
  [AGE_FILTER_NUMBER_TYPE.between]: AgeFilterComparator.BETWEEN,
} as const;

export const ageFilterComparatorToTypeMap: Record<
  AgeFilterComparator,
  AgeFilterNumberTypeValue
> = {
  [AgeFilterComparator.LTE]: AGE_FILTER_NUMBER_TYPE.lowerOrEqual,
  [AgeFilterComparator.GTE]: AGE_FILTER_NUMBER_TYPE.greaterOrEqual,
  [AgeFilterComparator.LT]: AGE_FILTER_NUMBER_TYPE.lowerOrEqual,
  [AgeFilterComparator.GT]: AGE_FILTER_NUMBER_TYPE.greaterOrEqual,
  [AgeFilterComparator.EQUAL]: AGE_FILTER_NUMBER_TYPE.equal,
  [AgeFilterComparator.BETWEEN]: AGE_FILTER_NUMBER_TYPE.between,
};
