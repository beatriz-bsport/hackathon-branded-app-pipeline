const BookingFilterTabTypes = ['future', 'past'] as const;

export type BookingFilterTab = (typeof BookingFilterTabTypes)[number];
