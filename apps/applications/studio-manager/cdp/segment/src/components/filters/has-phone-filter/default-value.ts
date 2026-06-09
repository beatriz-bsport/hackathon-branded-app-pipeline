import type { HasPhoneFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new has phone filter card.
 * Product default is "Has phone" (`value: true`) per smartlist has phone contract.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultHasPhoneFilter = (
  smartlistId: number,
): HasPhoneFilterFormValue => ({
  smartlist: smartlistId,
  value: true,
});
