// @ts-nocheck
import { Booking } from '../../api/types';
import { ConsumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';

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

function randomBoolean() {
  const table = [true, false];
  return table[randomInt(2)];
}

export function BookingFactory(memberId: number): Booking {
  const bookingId = randomInt(1000);
  return {
    attendance: randomBoolean(),
    attendance_date_updated: randomDate(),
    booking_status_code: 0,
    consumer_payment_pack: ConsumerPaymentPackFactory(bookingId),
    date: randomDate(),
    date_canceled: randomDate(),
    first_in_company: randomBoolean(),
    id: bookingId,
    staff_history: [],
    member: memberId,
  };
}

export function BookingListFactory(
  length: number,
  idList: number[],
): Array<Booking> {
  const res = new Array(length).fill(0);
  return res.map((_, i) => BookingFactory(idList[i]));
}
