import { NUMERIC_COMPARATOR_OPERATORS } from "./constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "./types";

const DEFAULT_FIRST_VALUE = 1;

export const defaultNumericComparatorFilterValue: NumericComparatorFilterValue =
  {
    operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    firstValue: DEFAULT_FIRST_VALUE,
    secondValue: DEFAULT_FIRST_VALUE + 1,
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

const isFiniteNumber = (value: number): boolean => {
  return !Number.isNaN(value) && Number.isFinite(value);
};
/**
 * Normalizes a numeric input value to a non-negative integer, optionally enforcing a minimum.
 */
export const getSanitizedPositiveInteger = (
  rawValue: string,
  min = 0,
): number | null => {
  if (rawValue.trim() === "") return null;

  const parsedValue = Number(rawValue);
  if (!isFiniteNumber(parsedValue)) return null;

  return Math.max(min, Math.floor(parsedValue));
};
