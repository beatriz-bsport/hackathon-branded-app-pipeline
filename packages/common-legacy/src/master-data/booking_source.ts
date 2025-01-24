type BookingSource = {
  id: number,
  text: string,
};

export const BOOKING_SOURCE_APP: BookingSource = {
  id: 0,
  text: 'app',
};

export const BOOKING_SOURCE_WEB: BookingSource = {
  id: 1,
  text: 'web',
};

export const BOOKING_SOURCE_SAAS: BookingSource = {
  id: 2,
  text: 'saas',
};

export const BOOKING_SOURCE_OTHER: BookingSource = {
  id: 3,
  text: 'other',
};

export const BOOKING_SOURCE_MIGRATION: BookingSource = {
  id: 4,
  text: 'migration',
};

const BOOKING_SOURCES: Array<BookingSource> = [
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
  BOOKING_SOURCE_OTHER,
  BOOKING_SOURCE_MIGRATION,
];

export default BOOKING_SOURCES;
