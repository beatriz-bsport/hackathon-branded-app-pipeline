import { SmartlistPrivateBookingsComparator } from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR = "09:00";

/** Upper bound default; paired with {@link APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR}. */
export const APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND = "18:00";

export const TOTAL_APPOINTMENTS_NUMBER_TYPE = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type TotalAppointmentsNumberTypeValue =
  (typeof TOTAL_APPOINTMENTS_NUMBER_TYPE)[keyof typeof TOTAL_APPOINTMENTS_NUMBER_TYPE];

/**
 * Total appointments filters only use comparators implemented in backend `do_filter`.
 */
export const isTotalAppointmentsNumberType = (
  operator: NumericComparatorOperator,
): operator is TotalAppointmentsNumberTypeValue =>
  operator === TOTAL_APPOINTMENTS_NUMBER_TYPE.between ||
  operator === TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual ||
  operator === TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual ||
  operator === TOTAL_APPOINTMENTS_NUMBER_TYPE.equal;

export const totalAppointmentsNumberTypeToComparatorMap = {
  [TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual]:
    SmartlistPrivateBookingsComparator.LTE,
  [TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual]:
    SmartlistPrivateBookingsComparator.GTE,
  [TOTAL_APPOINTMENTS_NUMBER_TYPE.equal]:
    SmartlistPrivateBookingsComparator.EQUAL,
  [TOTAL_APPOINTMENTS_NUMBER_TYPE.between]:
    SmartlistPrivateBookingsComparator.BETWEEN,
} as const;

export const totalAppointmentsNumberComparatorToTypeMap = {
  [SmartlistPrivateBookingsComparator.LTE]:
    TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual,
  [SmartlistPrivateBookingsComparator.GTE]:
    TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
  [SmartlistPrivateBookingsComparator.EQUAL]:
    TOTAL_APPOINTMENTS_NUMBER_TYPE.equal,
  [SmartlistPrivateBookingsComparator.BETWEEN]:
    TOTAL_APPOINTMENTS_NUMBER_TYPE.between,
} as const;
