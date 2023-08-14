// @ts-nocheck
import { ConsumerPaymentPack } from './types';
import { PaymentPackFactory } from '#libs/payment-packs/factory';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function randomDate() {
  const y = (1950 + randomInt(70)).toString();
  const m = randomInt(13);
  let mm = '';
  if (m < 11) {
    mm = `0${m.toString()}`;
  } else {
    mm = m.toString();
  }

  const d = randomInt(31) + 1;
  let dd = '';
  if (d < 11) {
    dd = `0${d.toString()}`;
  } else {
    dd = d.toString();
  }

  return `${y}-${mm}-${dd}`;
}

export function ConsumerPaymentPackFactory(
  bookingId: number,
): ConsumerPaymentPack {
  const paymentPackId = randomInt(1000);
  return {
    id: randomInt(1000),
    used_credits: randomInt(10),
    available_credits: randomInt(10),
    bookings: [`${bookingId}`],
    starting_date: randomDate(),
    ending_date: randomDate(),
    payment_pack_id: `${paymentPackId}`,
    payment_pack: PaymentPackFactory(paymentPackId),
  };
}
