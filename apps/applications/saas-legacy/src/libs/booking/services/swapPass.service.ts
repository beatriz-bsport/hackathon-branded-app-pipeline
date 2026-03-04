import type { Booking } from '#src/libs/booking/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';

export type CompatibleConsumerPaymentPack = ConsumerPaymentPack<
  number | PaymentPack
>;

export const getBookingConsumerPaymentPackId = (
  booking?: Booking,
): number | null => {
  const consumerPaymentPack = booking?.consumer_payment_pack;
  if (!consumerPaymentPack) return null;

  if (typeof consumerPaymentPack === 'number') {
    return consumerPaymentPack;
  }

  return consumerPaymentPack.id;
};

export const filterCompatibleConsumerPaymentPacksForPassSwap = (
  compatibleConsumerPaymentPacks: CompatibleConsumerPaymentPack[] = [],
  currentConsumerPaymentPackId: number | null,
): CompatibleConsumerPaymentPack[] => {
  return compatibleConsumerPaymentPacks.filter((consumerPaymentPack) => {
    if (!consumerPaymentPack || consumerPaymentPack.reverted) {
      return false;
    }

    if (currentConsumerPaymentPackId === null) {
      return true;
    }

    return consumerPaymentPack.id !== currentConsumerPaymentPackId;
  });
};

export const getConsumerPaymentPackPaymentPackId = (
  consumerPaymentPack?: CompatibleConsumerPaymentPack,
): number | null => {
  if (!consumerPaymentPack) {
    return null;
  }

  const paymentPack = consumerPaymentPack.payment_pack;
  if (typeof paymentPack === 'number') {
    return paymentPack;
  }

  if (paymentPack?.id) {
    return paymentPack.id;
  }

  const parsedPaymentPackId = parseInt(
    `${consumerPaymentPack.payment_pack_id || ''}`,
    10,
  );

  return Number.isNaN(parsedPaymentPackId) ? null : parsedPaymentPackId;
};

export const getCompatibleConsumerPaymentPackName = (
  compatibleConsumerPaymentPack: CompatibleConsumerPaymentPack,
  index: number,
  paymentPacksById?: Record<number, PaymentPack>,
): string => {
  const paymentPack = compatibleConsumerPaymentPack?.payment_pack;
  if (
    paymentPack &&
    typeof paymentPack !== 'number' &&
    typeof paymentPack.name === 'string'
  ) {
    return paymentPack.name;
  }

  const paymentPackId = getConsumerPaymentPackPaymentPackId(
    compatibleConsumerPaymentPack,
  );
  const paymentPackNameFromStore =
    paymentPackId !== null ? paymentPacksById?.[paymentPackId]?.name : null;
  if (paymentPackNameFromStore) {
    return paymentPackNameFromStore;
  }

  return `Consumer pass ${compatibleConsumerPaymentPack?.id ?? index + 1}`;
};
