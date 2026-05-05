import { NUMERIC_COMPARATOR_OPERATORS } from "./constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "./types";

export const defaultNumericComparatorFilterValue: NumericComparatorFilterValue =
  {
    operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    firstValue: null,
    secondValue: null,
  };

/**
 * Runtime guard for numeric comparator operator values.
 */
export const isNumericComparatorOperator = (
  key: string,
): key is NumericComparatorOperator => {
  return Object.values(NUMERIC_COMPARATOR_OPERATORS).some(
    (operator) => operator === key,
  );
};

/**
 * Normalizes a numeric input value to a positive integer.
 */
export const getSanitizedPositiveInteger = (
  rawValue: string,
): number | null => {
  if (rawValue.trim() === "") return null;

  const parsedValue = Number(rawValue);
  if (Number.isNaN(parsedValue)) return null;

  return Math.max(0, Math.floor(parsedValue));
};
