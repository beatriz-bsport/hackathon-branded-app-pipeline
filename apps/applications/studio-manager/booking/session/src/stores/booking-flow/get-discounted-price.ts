import type { DiscountState } from "./types";

export const getDiscountedPrice = (
  basePrice: number,
  discount: DiscountState | null,
): number => {
  if (!discount?.enabled || discount.value <= 0) return basePrice;

  if (discount.type === "percentage") {
    const factor = Math.min(100, Math.max(0, discount.value)) / 100;
    return Math.max(0, basePrice * (1 - factor));
  }

  return Math.max(0, basePrice - discount.value);
};
