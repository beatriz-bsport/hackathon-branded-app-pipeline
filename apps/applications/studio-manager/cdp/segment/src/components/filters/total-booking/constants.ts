import { SmartlistTotalBookingComparator } from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

/** Used when hydrating from API (null hour) or when resetting the booking hour range sub-filter. */
export const BOOKING_HOUR_RANGE_DEFAULT_HOUR = "09:00";

/** Upper bound default; paired with {@link BOOKING_HOUR_RANGE_DEFAULT_HOUR}. */
export const BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND = "18:00";

export const TOTAL_BOOKING_NUMBER_TYPE = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type TotalBookingNumberTypeValue =
  (typeof TOTAL_BOOKING_NUMBER_TYPE)[keyof typeof TOTAL_BOOKING_NUMBER_TYPE];

/**
 * Total booking filters only use the numeric comparator operators listed on {@link TOTAL_BOOKING_NUMBER_TYPE}.
 */
export const isTotalBookingNumberType = (
  operator: NumericComparatorOperator,
): operator is TotalBookingNumberTypeValue =>
  operator === TOTAL_BOOKING_NUMBER_TYPE.between ||
  operator === TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual ||
  operator === TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual ||
  operator === TOTAL_BOOKING_NUMBER_TYPE.equal;

export const totalBookingNumberTypeToComparatorMap = {
  [TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual]: SmartlistTotalBookingComparator.LTE,
  [TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual]:
    SmartlistTotalBookingComparator.GTE,
  [TOTAL_BOOKING_NUMBER_TYPE.equal]: SmartlistTotalBookingComparator.EQUAL,
  [TOTAL_BOOKING_NUMBER_TYPE.between]: SmartlistTotalBookingComparator.BETWEEN,
} as const;

export const totalBookingNumberComparatorToTypeMap = {
  [SmartlistTotalBookingComparator.LTE]: TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual,
  [SmartlistTotalBookingComparator.GTE]:
    TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual,
  [SmartlistTotalBookingComparator.EQUAL]: TOTAL_BOOKING_NUMBER_TYPE.equal,
  [SmartlistTotalBookingComparator.BETWEEN]: TOTAL_BOOKING_NUMBER_TYPE.between,
} as const;
