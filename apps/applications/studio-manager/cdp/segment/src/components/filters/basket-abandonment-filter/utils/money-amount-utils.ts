/**
 * Form basket amount (whole currency units) maps 1:1 to API `basket_value`.
 */
export const formAmountToApiBasketValue = (amount: number): number => amount;

/**
 * API `basket_value` maps 1:1 to the form amount.
 */
export const apiBasketValueToFormAmount = (apiValue: number): number =>
  Math.max(0, Math.round(apiValue));
