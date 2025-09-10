type BookingSource = {
  id: number;
  text: string;
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

export const BOOKING_SOURCE_AGGREGATOR: BookingSource = {
  id: 5,
  text: 'aggregator',
};

export const BOOKING_SOURCE_UNKNOWN: BookingSource = {
  id: 6,
  text: 'unknown',
};

export const BOOKING_SOURCE_QUICKSALE: BookingSource = {
  id: 7,
  text: 'quicksale',
};

export const BOOKING_SOURCE_COMPANY_BRANDED_APP: BookingSource = {
  id: 8,
  text: 'company_branded_app',
};

export const BOOKING_SOURCE_FRANCHISOR_BRANDED_APP: BookingSource = {
  id: 9,
  text: 'franchisor_branded_app',
};

export const BOOKING_SOURCE_BSPORT_GENERAL_APP: BookingSource = {
  id: 10,
  text: 'bsport_general_app',
};

export const BOOKING_SOURCE_DJANGO_ADMIN: BookingSource = {
  id: 11,
  text: 'django_admin',
};

const BOOKING_SOURCES: Array<BookingSource> = [
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
  BOOKING_SOURCE_OTHER,
  BOOKING_SOURCE_MIGRATION,
  BOOKING_SOURCE_AGGREGATOR,
  BOOKING_SOURCE_UNKNOWN,
  BOOKING_SOURCE_QUICKSALE,
  BOOKING_SOURCE_COMPANY_BRANDED_APP,
  BOOKING_SOURCE_FRANCHISOR_BRANDED_APP,
  BOOKING_SOURCE_BSPORT_GENERAL_APP,
  BOOKING_SOURCE_DJANGO_ADMIN,
];

export default BOOKING_SOURCES;
