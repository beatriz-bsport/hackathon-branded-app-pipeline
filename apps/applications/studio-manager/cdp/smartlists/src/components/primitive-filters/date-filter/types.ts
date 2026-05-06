import type {
  ABSOLUTE_DATE_OPERATOR_BETWEEN,
  ABSOLUTE_DATE_OPERATOR_EXACTLY_ON,
  ABSOLUTE_DATE_OPERATOR_ON_OR_AFTER,
  ABSOLUTE_DATE_OPERATOR_ON_OR_BEFORE,
  DATE_FILTER_TYPE_ABSOLUTE,
  DATE_FILTER_TYPE_RELATIVE,
  RELATIVE_DATE_OPERATOR_FUTURE_BETWEEN,
  RELATIVE_DATE_OPERATOR_FUTURE_EXACTLY,
  RELATIVE_DATE_OPERATOR_FUTURE_MORE_THAN,
  RELATIVE_DATE_OPERATOR_PAST_BETWEEN,
  RELATIVE_DATE_OPERATOR_PAST_EXACTLY,
  RELATIVE_DATE_OPERATOR_PAST_MORE_THAN,
} from "./constants";

export type DateFilterType =
  | typeof DATE_FILTER_TYPE_ABSOLUTE
  | typeof DATE_FILTER_TYPE_RELATIVE;

export type AbsoluteDateOperator =
  | typeof ABSOLUTE_DATE_OPERATOR_ON_OR_BEFORE
  | typeof ABSOLUTE_DATE_OPERATOR_ON_OR_AFTER
  | typeof ABSOLUTE_DATE_OPERATOR_EXACTLY_ON
  | typeof ABSOLUTE_DATE_OPERATOR_BETWEEN;

export type RelativeDateOperator =
  | typeof RELATIVE_DATE_OPERATOR_PAST_MORE_THAN
  | typeof RELATIVE_DATE_OPERATOR_PAST_EXACTLY
  | typeof RELATIVE_DATE_OPERATOR_PAST_BETWEEN
  | typeof RELATIVE_DATE_OPERATOR_FUTURE_MORE_THAN
  | typeof RELATIVE_DATE_OPERATOR_FUTURE_EXACTLY
  | typeof RELATIVE_DATE_OPERATOR_FUTURE_BETWEEN;

export type DateFilterValue = {
  dateType: DateFilterType;
  absolute: {
    operator: AbsoluteDateOperator;
    fromDate: string | null;
    toDate: string | null;
  };
  relative: {
    operator: RelativeDateOperator;
    firstDays: number | null;
    secondDays: number | null;
  };
};

export type RelativeAlertMessagePayload = {
  key: "onAndBefore" | "on" | "onAndAfter" | "fromTo";
  values: Record<string, string>;
};

export type RelativeAlertKey = RelativeAlertMessagePayload["key"];
