type BookingStatusCode = {
  id: number;
  text: string;
};

export const BOOKING_STATUS_OK: BookingStatusCode = {
  id: 0,
  text: 'OK',
};

export const BOOKING_STATUS_CANCELLED_BY_MANAGER: BookingStatusCode = {
  id: 1,
  text: 'CANCELLED_BY_MANAGER',
};
export const BOOKING_STATUS_CANCELLED_BY_CONSUMER: BookingStatusCode = {
  id: 2,
  text: 'CANCELLED_BY_CONSUMER',
};
export const BOOKING_STATUS_CANCELLED_BY_OFFER: BookingStatusCode = {
  id: 3,
  text: 'CANCELLED_BY_OFFER',
};

const BOOKING_STATUS_CODES: Array<BookingStatusCode> = [
  BOOKING_STATUS_OK,
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
];

export default BOOKING_STATUS_CODES;
