import type { ConsumerGiftcard } from "@bsport/api-buyables";
import { isPast } from "@bsport/datetime-manipulation";

import type { GiftcardPurchaseStatus } from "./types";

// CF decision tree: https://www.figma.com/board/by89KKY66udePz6d5WJbKE/States-graphes?node-id=0-1&p=f&t=OtTb48RqXPTTSe0G-0
export function getStatusFromPurchasedGiftcard(
  purchasedGiftcard: ConsumerGiftcard<number, unknown, unknown>,
): GiftcardPurchaseStatus {
  if (purchasedGiftcard.reverted) {
    return "cancelled";
  }

  const value = parseFloat(purchasedGiftcard.price_bought);
  const consumed = parseFloat(purchasedGiftcard.consumed_amount_gifted);
  if (consumed >= value) {
    return "redeemed";
  }

  if (
    purchasedGiftcard.expiration_date &&
    isPast(purchasedGiftcard.expiration_date)
  ) {
    return "expired";
  }

  if (purchasedGiftcard.dst_member != null) {
    return "active";
  }

  return "unclaimed";
}
