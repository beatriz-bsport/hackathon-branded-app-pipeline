import { getCurrencyDisplayWithPrice } from "@bsport/currency";

/** Item shape used for price extraction (price_cts and/or price from API) */
export type ItemWithPrice = {
  price_cts?: number;
  price?: string | number | null;
};

/**
 * Derives price in cents, decimal price, and formatted label from an item
 * that has price_cts and/or price. Prefers price_cts when present.
 */
export function getPriceFromItem(item: ItemWithPrice): {
  priceCts: number;
  price: number;
  priceLabel: string;
} {
  const parsedPrice =
    item.price != null && item.price !== ""
      ? parseFloat(String(item.price))
      : NaN;
  const validatedPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;
  const rawPriceCts = item.price_cts ?? Math.round(validatedPrice * 100);
  const priceCts = Number.isFinite(rawPriceCts) ? rawPriceCts : 0;
  const price = priceCts / 100;
  const priceLabel = getCurrencyDisplayWithPrice(price);
  return { priceCts, price, priceLabel };
}
