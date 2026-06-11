import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

import type { BasketAbandonmentFilterFormValue } from "./types";

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
    firstValue: 0,
    secondValue: null,
  },
  abandonmentDate: createDefaultDateFilterValue(),
});
