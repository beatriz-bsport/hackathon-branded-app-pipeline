import type { ConsumerGiftcard } from "@bsport/api-buyables";

export type PaymentFlowGiftCardSource = ConsumerGiftcard;

export type PaymentFlowGiftCard = {
  id: number;
  label: string;
  incrementalIdentifier: string;
  printableCode: string | null;
  expirationDate: string | null;
  totalAmount: number;
  consumedAmount: number;
  availableAmount: number;
};
