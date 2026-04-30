import type { NUMERIC_COMPARATOR_OPERATORS } from "./constants";

export type NumericComparatorOperator =
  (typeof NUMERIC_COMPARATOR_OPERATORS)[keyof typeof NUMERIC_COMPARATOR_OPERATORS];

export type NumericComparatorFilterValue = {
  operator: NumericComparatorOperator;
  firstValue: number | null;
  secondValue: number | null;
};
