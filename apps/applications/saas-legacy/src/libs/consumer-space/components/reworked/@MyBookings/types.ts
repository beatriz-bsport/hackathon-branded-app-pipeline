const BookingFilterTabTypes = ['future', 'past', 'waitlist'] as const;

export type BookingFilterTab = (typeof BookingFilterTabTypes)[number];

const BookingTabTypes = ['activity', 'appointment', 'workshop'] as const;

export type BookingTab = (typeof BookingTabTypes)[number];
