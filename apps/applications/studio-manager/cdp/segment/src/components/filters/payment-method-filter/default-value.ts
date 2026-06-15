import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { OWNS_PAYMENT_METHOD } from "./constants";
import type { PaymentMethodFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new saved payment method filter card.
 *
 * Matches backend model defaults: `owns_payment_method: true`, date sub-filter off.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultPaymentMethodFilter = (
  smartlistId: number,
): PaymentMethodFilterFormValue => ({
  smartlist: smartlistId,
  ownsPaymentMethod: OWNS_PAYMENT_METHOD.has,
  subFilters: [],
  expirationDate: createDefaultDateFilterValue(),
});
