import type { TermsAndConditionsFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new terms and conditions filter card.
 * Product default is "Accepted" (`value: true`) per smartlist terms and conditions contract.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultTermsAndConditionsFilter = (
  smartlistId: number,
): TermsAndConditionsFilterFormValue => ({
  smartlist: smartlistId,
  value: true,
});
