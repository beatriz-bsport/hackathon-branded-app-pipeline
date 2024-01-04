const BookingTabTypes = ['activity', 'workshop'] as const;

export type BookingTab = (typeof BookingTabTypes)[number];
