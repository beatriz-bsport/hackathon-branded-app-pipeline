import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import type { AppointmentPassFilterFormValue } from "./types";

/**
 * Default UI state for a new appointment pass filter card.
 *
 * Matches studio create defaults: all passes in scope, ownership "own",
 * sub-filters off.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultAppointmentPassFilter = (
  smartlistId: number,
): AppointmentPassFilterFormValue => ({
  smartlist: smartlistId,
  ownership: OWNERSHIP_OPTIONS.own,
  selectAllPaymentPacks: false,
  selectedPaymentPackIds: [],
  subFilters: [],
  purchaseDate: createDefaultDateFilterValue(),
  expirationDate: createDefaultDateFilterValue(),
  creditLeft: defaultNumericComparatorFilterValue,
});
