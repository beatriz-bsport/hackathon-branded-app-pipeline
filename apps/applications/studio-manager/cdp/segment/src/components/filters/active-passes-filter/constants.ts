import { SmartlistActivePassesComparator } from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const ACTIVE_PASSES_COMPARATOR_TYPE = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type ActivePassesComparatorTypeValue =
  (typeof ACTIVE_PASSES_COMPARATOR_TYPE)[keyof typeof ACTIVE_PASSES_COMPARATOR_TYPE];

/** Minimum pass count accepted by the active passes API (`nb_active_passes_value >= 1`). */
export const MIN_ACTIVE_PASSES_COMPARATOR_VALUE = 1;

/**
 * Narrows a `NumericComparatorOperator` to one of the four supported
 * active-passes comparator strings.
 */
export const isActivePassesComparatorType = (
  operator: NumericComparatorOperator,
): operator is ActivePassesComparatorTypeValue =>
  operator === ACTIVE_PASSES_COMPARATOR_TYPE.between ||
  operator === ACTIVE_PASSES_COMPARATOR_TYPE.lowerOrEqual ||
  operator === ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual ||
  operator === ACTIVE_PASSES_COMPARATOR_TYPE.equal;

/**
 * Maps frontend comparator operator strings to backend integer values.
 */
export const activePassesComparatorTypeToApiValueMap = {
  [ACTIVE_PASSES_COMPARATOR_TYPE.lowerOrEqual]:
    SmartlistActivePassesComparator.LTE,
  [ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual]:
    SmartlistActivePassesComparator.GTE,
  [ACTIVE_PASSES_COMPARATOR_TYPE.equal]: SmartlistActivePassesComparator.EQUAL,
  [ACTIVE_PASSES_COMPARATOR_TYPE.between]:
    SmartlistActivePassesComparator.BETWEEN,
} as const;

/**
 * Maps backend integer comparator values to frontend operator strings.
 */
export const activePassesApiValueToComparatorTypeMap: Record<
  SmartlistActivePassesComparator,
  ActivePassesComparatorTypeValue
> = {
  [SmartlistActivePassesComparator.LTE]:
    ACTIVE_PASSES_COMPARATOR_TYPE.lowerOrEqual,
  [SmartlistActivePassesComparator.GTE]:
    ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual,
  [SmartlistActivePassesComparator.EQUAL]: ACTIVE_PASSES_COMPARATOR_TYPE.equal,
  [SmartlistActivePassesComparator.BETWEEN]:
    ACTIVE_PASSES_COMPARATOR_TYPE.between,
};
