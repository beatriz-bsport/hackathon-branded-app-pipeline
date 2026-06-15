import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";
import { getLocalNow } from "@bsport/datetime-manipulation";

import {
  DATE_FILTER_TYPE_ABSOLUTE,
  DATE_FILTER_TYPE_RELATIVE,
  FUTURE_DATE_OPERATORS,
  PAST_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import type {
  DateFilterValue,
  RelativeDateOperator,
} from "#src/components/primitive-filters/date-filter/types";
import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import {
  ABSOLUTE_DATE_OPERATOR_BY_SMARTLIST_DATE_FILTER_TYPE,
  DATE_FILTER_TYPE_BY_OPERATOR,
  getRelativeDateOperatorBySmartlistDateFilterType,
} from "./smartlist-date-mapping-constants";

const toIsoDate = (value: string | null) => value ?? "";

const toNumericValue = (value: number | null) => (value === null ? 0 : value);

const toAbsoluteNumericValue = (value: number | null) => {
  if (value === null || value === 0) {
    return null;
  }

  return Math.abs(value);
};

/**
 * Returns today's date in ISO `yyyy-MM-dd` form for API fallbacks.
 */
export const getDefaultApiDate = (): string => {
  return getLocalNow({}).toISODate() ?? "";
};

const getRequiredAbsoluteSecondDate = ({
  fromDate,
  toDate,
}: {
  fromDate: string | null;
  toDate: string | null;
}) => {
  return toDate ?? fromDate ?? "";
};

/**
 * Maps the primitive `DateFilterValue` to the API `date_filter_type` enum.
 */
export const mapDateFilterType = (
  dateFilterValue: DateFilterValue,
): SmartlistDateFilterType => {
  if (dateFilterValue.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    return DATE_FILTER_TYPE_BY_OPERATOR[dateFilterValue.absolute.operator];
  }
  return DATE_FILTER_TYPE_BY_OPERATOR[dateFilterValue.relative.operator];
};

type SmartlistAbsoluteDateFilterType =
  | SmartlistDateFilterType.DATE_AFTER
  | SmartlistDateFilterType.DATE_BEFORE
  | SmartlistDateFilterType.DATE_BETWEEN
  | SmartlistDateFilterType.DATE_EXACT;

const isAbsoluteSmartlistDateFilterType = (
  dateFilterType: SmartlistDateFilterType,
): dateFilterType is SmartlistAbsoluteDateFilterType => {
  return (
    dateFilterType === SmartlistDateFilterType.DATE_AFTER ||
    dateFilterType === SmartlistDateFilterType.DATE_BEFORE ||
    dateFilterType === SmartlistDateFilterType.DATE_BETWEEN ||
    dateFilterType === SmartlistDateFilterType.DATE_EXACT
  );
};

const mapApiDateTypeToFormValue = (
  dateFilterType: SmartlistDateFilterType,
  firstDuration?: number | null,
): DateFilterValue => {
  const defaultDate = createDefaultDateFilterValue();

  if (isAbsoluteSmartlistDateFilterType(dateFilterType)) {
    const absoluteDateFilterType = dateFilterType;
    return {
      ...defaultDate,
      dateType: DATE_FILTER_TYPE_ABSOLUTE,
      absolute: {
        ...defaultDate.absolute,
        operator:
          ABSOLUTE_DATE_OPERATOR_BY_SMARTLIST_DATE_FILTER_TYPE[
            absoluteDateFilterType
          ] ?? defaultDate.absolute.operator,
      },
    };
  }

  return {
    ...defaultDate,
    dateType: DATE_FILTER_TYPE_RELATIVE,
    relative: {
      ...defaultDate.relative,
      operator: getRelativeDateOperatorBySmartlistDateFilterType({
        dateFilterType,
        firstDuration,
      }),
    },
  };
};

const toSignedRelativeDuration = (
  operator: RelativeDateOperator,
  value: number | null,
) => {
  const numericValue = toNumericValue(value);

  if (numericValue === 0) {
    return 0;
  }

  if (PAST_DATE_OPERATORS.includes(operator)) {
    return -Math.abs(numericValue);
  }
  if (FUTURE_DATE_OPERATORS.includes(operator)) {
    return Math.abs(numericValue);
  }
  return numericValue;
};

/**
 * Serializes a `DateFilterValue` plus resolved API type into date + duration
 * fields expected by smartlist filter serializers.
 */
export const toApiDateSection = (
  dateFilterValue: DateFilterValue,
  dateFilterType: SmartlistDateFilterType,
) => {
  const fallbackDate =
    dateFilterValue.absolute.fromDate ??
    dateFilterValue.absolute.toDate ??
    getDefaultApiDate();
  const fromDate = dateFilterValue.absolute.fromDate ?? fallbackDate;
  const toDate = dateFilterValue.absolute.toDate;

  const firstDurationValue = isAbsoluteSmartlistDateFilterType(dateFilterType)
    ? toNumericValue(dateFilterValue.relative.firstDays)
    : toSignedRelativeDuration(
        dateFilterValue.relative.operator,
        dateFilterValue.relative.firstDays,
      );

  const secondDurationValue = toSignedRelativeDuration(
    dateFilterValue.relative.operator,
    dateFilterValue.relative.secondDays,
  );

  return {
    fromDate: toIsoDate(fromDate),
    toDate: toIsoDate(
      getRequiredAbsoluteSecondDate({
        fromDate,
        toDate,
      }),
    ),
    firstDurationValue,
    secondDurationValue,
  };
};

/**
 * Hydrates a `DateFilterValue` from persisted API fields.
 */
export const toFormDateSection = (
  dateFilterType: SmartlistDateFilterType,
  absoluteFromDate: string,
  absoluteToDate: string,
  firstDuration: number | null,
  secondDuration: number | null,
): DateFilterValue => {
  const dateFilterBaseValue = mapApiDateTypeToFormValue(
    dateFilterType,
    firstDuration,
  );

  return {
    ...dateFilterBaseValue,
    absolute: {
      ...dateFilterBaseValue.absolute,
      fromDate: absoluteFromDate || null,
      toDate: absoluteToDate || null,
    },
    relative: {
      ...dateFilterBaseValue.relative,
      firstDays: toAbsoluteNumericValue(firstDuration),
      secondDays: toAbsoluteNumericValue(secondDuration),
    },
  };
};
