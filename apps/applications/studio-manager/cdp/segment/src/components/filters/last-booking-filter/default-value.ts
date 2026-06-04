import type { LastBookingFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new last booking filter card.
 * Product requires the user to enter days explicitly — no default `value`.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultLastBookingFilter = (
  smartlistId: number,
): LastBookingFilterFormValue => ({
  smartlist: smartlistId,
  value: null,
});
