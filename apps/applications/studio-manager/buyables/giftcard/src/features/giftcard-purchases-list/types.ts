import type { ConsumerGiftcard } from "@bsport/api-buyables";

export type PersonCell = {
  id: number;
  name?: string;
  avatarSrc?: string;
} | null;

export type GiftcardPurchase = ConsumerGiftcard<number, PersonCell, PersonCell>;
