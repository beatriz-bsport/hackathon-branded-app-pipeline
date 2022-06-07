import { getPrice } from '#libs/theme/utils';
import { Basket, PrepaidLine } from './types';

export const getBasketTotalPriceExcludingTax = (
  basket: Basket | Basket<string, PrepaidLine>,
) => {
  // if we don't have items, or items with no quantity, price returned is always 0
  if (
    !basket.checkout_items.length ||
    basket.checkout_items.reduce(
      (acc, ci) => (ci.tax ? acc + ci.quantity : acc),
      0,
    ) === 0
  ) {
    return 0;
  }

  const sum_prices_without_vouchers = basket.checkout_items.reduce(
    (acc, ci) => (ci.tax ? acc + ci.unit_price * ci.quantity : acc),
    0,
  );

  // we calculate the mean tax among products to apply it to the entire basket
  const mean_tax =
    sum_prices_without_vouchers !== 0
      ? // if the sum of the prices is not null, we take the mean tax pondered by prices
        basket.checkout_items.reduce(
          (acc, ci) =>
            ci.tax ? acc + ci.unit_price * ci.tax * ci.quantity : acc,
          0,
        ) / sum_prices_without_vouchers
      : // else, in the situation where all prices are null, we ponderate through quantity
        basket.checkout_items.reduce(
          (acc, ci) => (ci.tax ? acc + ci.tax * ci.quantity : acc),
          0,
        ) /
        basket.checkout_items.reduce(
          (acc, ci) => (ci.tax ? acc + ci.quantity : acc),
          0,
        );

  const sum_prices = basket.checkout_items.reduce(
    (acc, ci) => acc + ci.unit_price * ci.quantity,
    0,
  );
  return parseFloat(getPrice(sum_prices, true, mean_tax)).toFixed(2);
};
