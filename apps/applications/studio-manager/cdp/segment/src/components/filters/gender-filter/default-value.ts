import { GENDER_OPTIONS } from "./constants";
import type { GenderFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new gender filter card.
 * Product default is Male (`"M"`) per smartlist gender filter contract.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultGenderFilter = (
  smartlistId: number,
): GenderFilterFormValue => ({
  smartlist: smartlistId,
  value: GENDER_OPTIONS.male,
});
