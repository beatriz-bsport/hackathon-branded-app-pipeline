import type { HasPasswordFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new has password filter card.
 * Product default is "Has set" (`value: true`) per smartlist has password contract.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultHasPasswordFilter = (
  smartlistId: number,
): HasPasswordFilterFormValue => ({
  smartlist: smartlistId,
  value: true,
});
