import {
  SMARTLIST_RELATIONS_COMPARATOR,
  type SmartlistRelationsComparator,
} from "@bsport/api-cdp/smartlist";

import {
  NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  NUMERIC_COMPARATOR_OPERATOR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
} from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

export const RELATIONSHIPS_COMPARATOR_OPERATOR = {
  between: NUMERIC_COMPARATOR_OPERATOR_BETWEEN,
  lowerOrEqual: NUMERIC_COMPARATOR_OPERATOR_LOWER_OR_EQUAL,
  greaterOrEqual: NUMERIC_COMPARATOR_OPERATOR_GREATER_OR_EQUAL,
  equal: NUMERIC_COMPARATOR_OPERATOR_EQUAL,
} as const;

export type RelationshipsComparatorOperatorValue =
  (typeof RELATIONSHIPS_COMPARATOR_OPERATOR)[keyof typeof RELATIONSHIPS_COMPARATOR_OPERATOR];

export const isRelationshipsComparatorOperator = (
  operator: NumericComparatorOperator,
): operator is RelationshipsComparatorOperatorValue =>
  operator === RELATIONSHIPS_COMPARATOR_OPERATOR.between ||
  operator === RELATIONSHIPS_COMPARATOR_OPERATOR.lowerOrEqual ||
  operator === RELATIONSHIPS_COMPARATOR_OPERATOR.greaterOrEqual ||
  operator === RELATIONSHIPS_COMPARATOR_OPERATOR.equal;

export const relationshipsOperatorToComparatorMap = {
  [RELATIONSHIPS_COMPARATOR_OPERATOR.lowerOrEqual]:
    SMARTLIST_RELATIONS_COMPARATOR.LTE,
  [RELATIONSHIPS_COMPARATOR_OPERATOR.greaterOrEqual]:
    SMARTLIST_RELATIONS_COMPARATOR.GTE,
  [RELATIONSHIPS_COMPARATOR_OPERATOR.equal]:
    SMARTLIST_RELATIONS_COMPARATOR.EQUAL,
  [RELATIONSHIPS_COMPARATOR_OPERATOR.between]:
    SMARTLIST_RELATIONS_COMPARATOR.BETWEEN,
} as const;

export const relationshipsComparatorToOperatorMap: Record<
  SmartlistRelationsComparator,
  RelationshipsComparatorOperatorValue
> = {
  [SMARTLIST_RELATIONS_COMPARATOR.LTE]:
    RELATIONSHIPS_COMPARATOR_OPERATOR.lowerOrEqual,
  [SMARTLIST_RELATIONS_COMPARATOR.GTE]:
    RELATIONSHIPS_COMPARATOR_OPERATOR.greaterOrEqual,
  [SMARTLIST_RELATIONS_COMPARATOR.EQUAL]:
    RELATIONSHIPS_COMPARATOR_OPERATOR.equal,
  [SMARTLIST_RELATIONS_COMPARATOR.BETWEEN]:
    RELATIONSHIPS_COMPARATOR_OPERATOR.between,
};
