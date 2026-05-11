import type {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "./constants";

export type NumericComparatorOperator =
  | typeof NUMERIC_COMPARATOR_OPERATOR_EQUAL
  | typeof NUMERIC_COMPARATOR_OPERATOR_BETWEEN
  | typeof NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL
  | typeof NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL;

export type NumericComparatorFilterValue = {
  operator: NumericComparatorOperator;
  firstValue: number | null;
  secondValue: number | null;
};
