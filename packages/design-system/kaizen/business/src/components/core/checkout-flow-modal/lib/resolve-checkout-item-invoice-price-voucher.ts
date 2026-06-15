import type { CheckoutFlowItem } from "#src/components/core/checkout-flow-modal/types";

type ResolveCheckoutItemInvoicePriceVoucherOptions = {
  /** When true, multiplies unit voucher by item quantity (promo-code preview API). */
  multiplyVoucherByQuantity?: boolean;
};

/**
 * Maps a checkout flow item to invoice API `price` / `voucher` fields.
 * The API expects unit gross price and discount amount.
 * Form state stores net `priceCts` plus `discountAmountCts`; do not derive voucher from
 * `discountPercent` on the net price (amount discounts also set a derived percent).
 */
export const resolveCheckoutItemInvoicePriceAndVoucher = (
  item: CheckoutFlowItem,
  options?: ResolveCheckoutItemInvoicePriceVoucherOptions,
): { price: string; voucher: string } => {
  const voucherQuantity = options?.multiplyVoucherByQuantity
    ? item.quantity
    : 1;
  const hasDiscount = item.discountAmountCts > 0 || item.discountPercent > 0;
  const unitGrossCts = hasDiscount
    ? item.priceCts + item.discountAmountCts
    : item.priceCts;
  const unitVoucherCts = hasDiscount ? item.discountAmountCts : 0;

  return {
    price: (unitGrossCts / 100).toFixed(2),
    voucher: ((unitVoucherCts * voucherQuantity) / 100).toFixed(2),
  };
};
