import { RelativeDateOperator } from "./types";

export const DATE_FILTER_TYPES: { absolute: "absolute"; relative: "relative" } =
  {
    absolute: "absolute",
    relative: "relative",
  };

export const ABSOLUTE_DATE_OPERATORS: {
  onOrBefore: "on_or_before";
  onOrAfter: "on_or_after";
  exactlyOn: "exactly_on";
  between: "between";
} = {
  onOrBefore: "on_or_before",
  onOrAfter: "on_or_after",
  exactlyOn: "exactly_on",
  between: "between",
};

export const RELATIVE_DATE_OPERATORS: {
  pastMoreThan: "past_more_than";
  pastExactly: "past_exactly";
  pastBetween: "past_between";
  futureMoreThan: "future_more_than";
  futureExactly: "future_exactly";
  futureBetween: "future_between";
} = {
  pastMoreThan: "past_more_than",
  pastExactly: "past_exactly",
  pastBetween: "past_between",
  futureMoreThan: "future_more_than",
  futureExactly: "future_exactly",
  futureBetween: "future_between",
};

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
