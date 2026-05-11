import { RelativeDateOperator } from "./types";

export const DATE_FILTER_TYPE_ABSOLUTE = "absolute";
export const DATE_FILTER_TYPE_RELATIVE = "relative";

export const DATE_FILTER_TYPES = {
  absolute: DATE_FILTER_TYPE_ABSOLUTE,
  relative: DATE_FILTER_TYPE_RELATIVE,
} as const;

export const ABSOLUTE_DATE_OPERATOR_ON_OR_BEFORE = "on_or_before";
export const ABSOLUTE_DATE_OPERATOR_ON_OR_AFTER = "on_or_after";
export const ABSOLUTE_DATE_OPERATOR_EXACTLY_ON = "exactly_on";
export const ABSOLUTE_DATE_OPERATOR_BETWEEN = "between";

export const ABSOLUTE_DATE_OPERATORS = {
  onOrBefore: ABSOLUTE_DATE_OPERATOR_ON_OR_BEFORE,
  onOrAfter: ABSOLUTE_DATE_OPERATOR_ON_OR_AFTER,
  exactlyOn: ABSOLUTE_DATE_OPERATOR_EXACTLY_ON,
  between: ABSOLUTE_DATE_OPERATOR_BETWEEN,
} as const;

export const RELATIVE_DATE_OPERATOR_PAST_MORE_THAN = "past_more_than";
export const RELATIVE_DATE_OPERATOR_PAST_EXACTLY = "past_exactly";
export const RELATIVE_DATE_OPERATOR_PAST_BETWEEN = "past_between";
export const RELATIVE_DATE_OPERATOR_FUTURE_MORE_THAN = "future_more_than";
export const RELATIVE_DATE_OPERATOR_FUTURE_EXACTLY = "future_exactly";
export const RELATIVE_DATE_OPERATOR_FUTURE_BETWEEN = "future_between";

export const RELATIVE_DATE_OPERATORS = {
  pastMoreThan: RELATIVE_DATE_OPERATOR_PAST_MORE_THAN,
  pastExactly: RELATIVE_DATE_OPERATOR_PAST_EXACTLY,
  pastBetween: RELATIVE_DATE_OPERATOR_PAST_BETWEEN,
  futureMoreThan: RELATIVE_DATE_OPERATOR_FUTURE_MORE_THAN,
  futureExactly: RELATIVE_DATE_OPERATOR_FUTURE_EXACTLY,
  futureBetween: RELATIVE_DATE_OPERATOR_FUTURE_BETWEEN,
} as const;

export const PAST_DATE_OPERATORS: RelativeDateOperator[] = [
  RELATIVE_DATE_OPERATORS.pastMoreThan,
  RELATIVE_DATE_OPERATORS.pastExactly,
  RELATIVE_DATE_OPERATORS.pastBetween,
];
export const FUTURE_DATE_OPERATORS: RelativeDateOperator[] = [
  RELATIVE_DATE_OPERATORS.futureMoreThan,
  RELATIVE_DATE_OPERATORS.futureExactly,
  RELATIVE_DATE_OPERATORS.futureBetween,
];
