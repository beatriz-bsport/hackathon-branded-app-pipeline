import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

import type { BasketAbandonmentFilterFormValue } from "./types";

const DEFAULT_BASKET_VALUE_FIRST_VALUE = 0;
const DEFAULT_BASKET_VALUE_SECOND_VALUE = DEFAULT_BASKET_VALUE_FIRST_VALUE + 1;

/**
 * Returns the default UI state for a brand-new abandoned basket filter card.
 *
 * Matches screenshot defaults: LTE comparator and 0,00 amount.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultBasketAbandonmentFilter = (
  smartlistId: number,
): BasketAbandonmentFilterFormValue => ({
  smartlist: smartlistId,
  subFilters: [],
  basketValue: {
    operator: NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
    firstValue: DEFAULT_BASKET_VALUE_FIRST_VALUE,
    secondValue: DEFAULT_BASKET_VALUE_SECOND_VALUE,
  },
  abandonmentDate: createDefaultDateFilterValue(),
});
