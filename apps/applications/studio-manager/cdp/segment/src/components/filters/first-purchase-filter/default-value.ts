import { FIRST_PURCHASE_STATUS } from "./constants";
import type { FirstPurchaseFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new first purchase filter card.
 *
 * Matches backend model defaults: `first_payment_is_done: true`.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultFirstPurchaseFilter = (
  smartlistId: number,
): FirstPurchaseFilterFormValue => ({
  smartlist: smartlistId,
  firstPurchaseStatus: FIRST_PURCHASE_STATUS.done,
});
