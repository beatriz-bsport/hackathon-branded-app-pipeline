const BookingTabTypes = ['activity', 'appointment', 'workshop'] as const;

export type BookingTab = (typeof BookingTabTypes)[number];
