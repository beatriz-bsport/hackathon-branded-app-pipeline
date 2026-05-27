import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import {
  ABSOLUTE_DATE_OPERATORS,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

/**
 * Maps primitive date UI operators to the smartlist API `date_filter_type` enum.
 */
export const DATE_FILTER_TYPE_BY_OPERATOR = {
  on_or_before: SmartlistDateFilterType.DATE_BEFORE,
  on_or_after: SmartlistDateFilterType.DATE_AFTER,
  exactly_on: SmartlistDateFilterType.DATE_EXACT,
  between: SmartlistDateFilterType.DATE_BETWEEN,
  past_more_than: SmartlistDateFilterType.DURATION_BEFORE_PAST,
  past_exactly: SmartlistDateFilterType.DURATION_EXACT,
  past_between: SmartlistDateFilterType.DURATION_BETWEEN,
  future_more_than: SmartlistDateFilterType.DURATION_AFTER,
  future_exactly: SmartlistDateFilterType.DURATION_EXACT,
  future_between: SmartlistDateFilterType.DURATION_BETWEEN,
} as const;

export const ABSOLUTE_DATE_OPERATOR_BY_SMARTLIST_DATE_FILTER_TYPE = {
  [SmartlistDateFilterType.DATE_AFTER]: ABSOLUTE_DATE_OPERATORS.onOrAfter,
  [SmartlistDateFilterType.DATE_BEFORE]: ABSOLUTE_DATE_OPERATORS.onOrBefore,
  [SmartlistDateFilterType.DATE_EXACT]: ABSOLUTE_DATE_OPERATORS.exactlyOn,
  [SmartlistDateFilterType.DATE_BETWEEN]: ABSOLUTE_DATE_OPERATORS.between,
} as const;

export const RELATIVE_DATE_OPERATOR_BY_SMARTLIST_DATE_FILTER_TYPE = {
  [SmartlistDateFilterType.DURATION_AFTER]:
    RELATIVE_DATE_OPERATORS.futureMoreThan,
  [SmartlistDateFilterType.DURATION_BEFORE]:
    RELATIVE_DATE_OPERATORS.pastMoreThan,
  [SmartlistDateFilterType.DURATION_BEFORE_PAST]:
    RELATIVE_DATE_OPERATORS.pastMoreThan,
} as const;

/**
 * Resolves relative date operator from API enum.
 * DURATION_EXACT and DURATION_BETWEEN are shared by past/future variants, so
 * we inspect the first duration sign to recover the original direction.
 */
export const getRelativeDateOperatorBySmartlistDateFilterType = ({
  dateFilterType,
  firstDuration,
}: {
  dateFilterType: SmartlistDateFilterType;
  firstDuration?: number | null;
}) => {
  if (dateFilterType === SmartlistDateFilterType.DURATION_EXACT) {
    return firstDuration !== null &&
      firstDuration !== undefined &&
      firstDuration > 0
      ? RELATIVE_DATE_OPERATORS.futureExactly
      : RELATIVE_DATE_OPERATORS.pastExactly;
  }

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    return firstDuration !== null &&
      firstDuration !== undefined &&
      firstDuration > 0
      ? RELATIVE_DATE_OPERATORS.futureBetween
      : RELATIVE_DATE_OPERATORS.pastBetween;
  }

  if (dateFilterType === SmartlistDateFilterType.DURATION_AFTER) {
    return RELATIVE_DATE_OPERATORS.futureMoreThan;
  }

  if (
    dateFilterType === SmartlistDateFilterType.DURATION_BEFORE ||
    dateFilterType === SmartlistDateFilterType.DURATION_BEFORE_PAST
  ) {
    return RELATIVE_DATE_OPERATORS.pastMoreThan;
  }

  return RELATIVE_DATE_OPERATORS.pastMoreThan;
};
