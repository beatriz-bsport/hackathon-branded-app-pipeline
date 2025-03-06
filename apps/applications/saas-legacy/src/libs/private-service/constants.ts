export const PRIVATE_PASS_MASS_EXTENSION_PAGE_SIZE = 5;
export const PRIVATE_CONSUMER_PASS_EXTENSION_PAGE_SIZE = 5;
export const MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH_OPTIONS = [
  1, 2, 3, 4, 6, 12,
];

// classpass constants
export const CLASSPASS_MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH = 1;
export const CLASSPASS_AVAILABILITY_PADDING = 0;
export const CLASSPASS_COMPATIBLE_BOOKING_INTERVALS = [5, 10, 15, 30, 60];

export enum DayTimeIntervals {
  MORNING = 'morning',
  NOON = 'noon',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
}

export enum ResourceIdentifier {
  COACH = 'associated_coach',
  ESTABLISHMENT = 'associated_establishment',
  PRIVATE_SERVICE = 'private_service',
}
