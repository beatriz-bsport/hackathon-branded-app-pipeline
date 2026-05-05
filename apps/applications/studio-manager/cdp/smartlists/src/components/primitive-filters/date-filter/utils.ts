import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "./constants";
import type {
  AbsoluteDateOperator,
  DateFilterType,
  DateFilterValue,
  RelativeAlertKey,
  RelativeAlertMessagePayload,
  RelativeDateOperator,
} from "./types";

export const defaultDateFilterValue: DateFilterValue = {
  dateType: DATE_FILTER_TYPES.absolute,
  absolute: {
    operator: ABSOLUTE_DATE_OPERATORS.onOrBefore,
    fromDate: null,
    toDate: null,
  },
  relative: {
    operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
    firstDays: null,
    secondDays: null,
  },
};

/**
 * Safely parses an ISO date and returns null if parsing fails.
 */
export const getDatePickerValue = (isoDate: string | null) => {
  if (!isoDate) return null;
  return fromIsoString(isoDate);
};

/**
 * Builds a relative date explanation based on the selected operator and day values.
 */
export const getRelativeAlertMessage = (
  operator: RelativeDateOperator,
  firstDays: number | null,
  secondDays: number | null,
): RelativeAlertMessagePayload | null => {
  if (firstDays === null || Number.isNaN(firstDays)) return null;

  const now = getLocalNow({}).startOf("day");
  const isPastOperator =
    operator === RELATIVE_DATE_OPERATORS.pastMoreThan ||
    operator === RELATIVE_DATE_OPERATORS.pastExactly ||
    operator === RELATIVE_DATE_OPERATORS.pastBetween;
  const firstDate = isPastOperator
    ? now.minus({ days: firstDays })
    : now.plus({ days: firstDays });
  const firstDateLabel = formatDateTimeFromDate(
    firstDate,
    DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
  );

  const alertKeyByOperator: Record<RelativeDateOperator, RelativeAlertKey> = {
    [RELATIVE_DATE_OPERATORS.pastMoreThan]: "onAndBefore",
    [RELATIVE_DATE_OPERATORS.pastExactly]: "on",
    [RELATIVE_DATE_OPERATORS.pastBetween]: "fromTo",
    [RELATIVE_DATE_OPERATORS.futureMoreThan]: "onAndAfter",
    [RELATIVE_DATE_OPERATORS.futureExactly]: "on",
    [RELATIVE_DATE_OPERATORS.futureBetween]: "fromTo",
  };
  const alertKey = alertKeyByOperator[operator];

  if (alertKey !== "fromTo") {
    return {
      key: alertKey,
      values: { date: firstDateLabel },
    };
  }

  if (secondDays === null || Number.isNaN(secondDays)) return null;

  const secondDate = isPastOperator
    ? now.minus({ days: secondDays })
    : now.plus({ days: secondDays });

  const earliestDate = firstDate <= secondDate ? firstDate : secondDate;
  const latestDate = firstDate <= secondDate ? secondDate : firstDate;

  return {
    key: alertKey,
    values: {
      earliestDate: formatDateTimeFromDate(
        earliestDate,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
      ),
      latestDate: formatDateTimeFromDate(
        latestDate,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
      ),
    },
  };
};

/**
 * Runtime guard for date filter type values.
 */
export const isDateFilterType = (key: string): key is DateFilterType => {
  return Object.values(DATE_FILTER_TYPES).some((value) => value === key);
};

/**
 * Runtime guard for absolute date operator values.
 */
export const isAbsoluteDateOperator = (
  key: string,
): key is AbsoluteDateOperator => {
  return Object.values(ABSOLUTE_DATE_OPERATORS).some((value) => value === key);
};

/**
 * Runtime guard for relative date operator values.
 */
export const isRelativeDateOperator = (
  key: string,
): key is RelativeDateOperator => {
  return Object.values(RELATIVE_DATE_OPERATORS).some((value) => value === key);
};
