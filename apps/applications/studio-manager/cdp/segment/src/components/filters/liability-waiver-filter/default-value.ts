import type { LiabilityWaiverFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new liability waiver filter card.
 * Product default is "Accepted" (`value: true`) per smartlist waiver contract.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultLiabilityWaiverFilter = (
  smartlistId: number,
): LiabilityWaiverFilterFormValue => ({
  smartlist: smartlistId,
  value: true,
});
