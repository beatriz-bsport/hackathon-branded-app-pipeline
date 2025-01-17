/* eslint-disable-next-line */
const BookingFilterTabTypes = ['future', 'past', 'waitlist'] as const;

export type BookingFilterTab = (typeof BookingFilterTabTypes)[number];

/* eslint-disable-next-line */
const BookingTabTypes = ['activity', 'appointment', 'workshop'] as const;

export type BookingTab = (typeof BookingTabTypes)[number];
