import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { OWNERSHIP_OPTIONS } from "./constants";
import type { PassesFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new pass filter card.
 *
 * `selectAllPaymentPacks` defaults to `false` so the user is forced to make
 * an explicit selection (or to opt into "all passes") before saving.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultPassesFilter = (
  smartlistId: number,
): PassesFilterFormValue => ({
  smartlist: smartlistId,
  ownership: OWNERSHIP_OPTIONS.own,
  selectAllPaymentPacks: false,
  selectedPaymentPackIds: [],
  subFilters: [],
  purchaseDate: defaultDateFilterValue,
});
