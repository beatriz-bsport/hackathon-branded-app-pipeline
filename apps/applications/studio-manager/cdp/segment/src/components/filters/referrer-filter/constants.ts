import {
  SMARTLIST_REFERRER_COMPARATOR,
  type SmartlistReferrerComparator,
} from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const REFERRER_COMPARATOR_OPERATOR = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type ReferrerComparatorOperatorValue =
  (typeof REFERRER_COMPARATOR_OPERATOR)[keyof typeof REFERRER_COMPARATOR_OPERATOR];

export const isReferrerComparatorOperator = (
  operator: NumericComparatorOperator,
): operator is ReferrerComparatorOperatorValue =>
  operator === REFERRER_COMPARATOR_OPERATOR.between ||
  operator === REFERRER_COMPARATOR_OPERATOR.lowerOrEqual ||
  operator === REFERRER_COMPARATOR_OPERATOR.greaterOrEqual ||
  operator === REFERRER_COMPARATOR_OPERATOR.equal;

export const referrerOperatorToComparatorMap = {
  [REFERRER_COMPARATOR_OPERATOR.lowerOrEqual]:
    SMARTLIST_REFERRER_COMPARATOR.LTE,
  [REFERRER_COMPARATOR_OPERATOR.greaterOrEqual]:
    SMARTLIST_REFERRER_COMPARATOR.GTE,
  [REFERRER_COMPARATOR_OPERATOR.equal]: SMARTLIST_REFERRER_COMPARATOR.EQUAL,
  [REFERRER_COMPARATOR_OPERATOR.between]: SMARTLIST_REFERRER_COMPARATOR.BETWEEN,
} as const;

export const referrerComparatorToOperatorMap: Record<
  SmartlistReferrerComparator,
  ReferrerComparatorOperatorValue
> = {
  [SMARTLIST_REFERRER_COMPARATOR.LTE]:
    REFERRER_COMPARATOR_OPERATOR.lowerOrEqual,
  [SMARTLIST_REFERRER_COMPARATOR.GTE]:
    REFERRER_COMPARATOR_OPERATOR.greaterOrEqual,
  [SMARTLIST_REFERRER_COMPARATOR.EQUAL]: REFERRER_COMPARATOR_OPERATOR.equal,
  [SMARTLIST_REFERRER_COMPARATOR.BETWEEN]: REFERRER_COMPARATOR_OPERATOR.between,
};
