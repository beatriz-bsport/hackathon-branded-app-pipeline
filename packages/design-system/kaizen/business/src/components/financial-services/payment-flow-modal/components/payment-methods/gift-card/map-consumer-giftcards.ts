import type { PaymentFlowGiftCard, PaymentFlowGiftCardSource } from "./types";

const toAmount = (value: string | undefined): number => {
  const parsed = Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

const toGiftCardLabel = (giftcard: PaymentFlowGiftCardSource): string => {
  if (giftcard.name.trim().length > 0) {
    return giftcard.name.trim();
  }

  if (giftcard.incremental_identifier.trim().length > 0) {
    return `#${giftcard.incremental_identifier.trim()}`;
  }

  return "";
};

const sortByExpiryAsc = (
  left: PaymentFlowGiftCard,
  right: PaymentFlowGiftCard,
): number => {
  if (left.expirationDate === right.expirationDate) return left.id - right.id;
  if (left.expirationDate === null) return 1;
  if (right.expirationDate === null) return -1;

  return left.expirationDate.localeCompare(right.expirationDate);
};

export const mapConsumerGiftcardToPaymentFlowGiftCard = (
  giftcard: PaymentFlowGiftCardSource,
  fallbackLabelPrefix: string,
): PaymentFlowGiftCard => {
  const label = toGiftCardLabel(giftcard);
  const totalAmount = toAmount(giftcard.price_bought);
  const consumedAmount = toAmount(giftcard.consumed_amount_gifted);
  const availableAmount = Math.max(
    0,
    Number((totalAmount - consumedAmount).toFixed(2)),
  );

  return {
    id: giftcard.id,
    label: label.length > 0 ? label : `${fallbackLabelPrefix} #${giftcard.id}`,
    incrementalIdentifier: giftcard.incremental_identifier,
    printableCode: giftcard.printable_code,
    expirationDate: giftcard.expiration_date,
    totalAmount,
    consumedAmount,
    availableAmount,
  };
};

export const mapAndSortConsumerGiftcards = (
  giftcards: PaymentFlowGiftCardSource[],
  fallbackLabelPrefix: string,
): PaymentFlowGiftCard[] => {
  return giftcards
    .map((giftcard) =>
      mapConsumerGiftcardToPaymentFlowGiftCard(giftcard, fallbackLabelPrefix),
    )
    .sort(sortByExpiryAsc);
};
