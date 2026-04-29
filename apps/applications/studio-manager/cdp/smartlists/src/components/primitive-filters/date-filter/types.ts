import type {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "./constants";

export type DateFilterType =
  (typeof DATE_FILTER_TYPES)[keyof typeof DATE_FILTER_TYPES];

export type AbsoluteDateOperator =
  (typeof ABSOLUTE_DATE_OPERATORS)[keyof typeof ABSOLUTE_DATE_OPERATORS];

export type RelativeDateOperator =
  (typeof RELATIVE_DATE_OPERATORS)[keyof typeof RELATIVE_DATE_OPERATORS];

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
