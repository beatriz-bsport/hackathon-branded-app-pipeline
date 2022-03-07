import { getPrice } from '#libs/theme/utils';
import { Basket } from './types';

export const getBasketTotalPriceExcludingTax = (basket: Basket) => {
  if (!basket.checkout_items.length) {
    return 0;
  }
  return basket.checkout_items.reduce(
    (acc, ci) =>
      acc + parseFloat(getPrice(ci.unit_price, true, ci.tax)) * ci.quantity,
    0,
  );
};
