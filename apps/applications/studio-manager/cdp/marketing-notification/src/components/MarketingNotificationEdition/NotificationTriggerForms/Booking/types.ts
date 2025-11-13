export const BOOKING_STATUS_PRESENT = "present";
export const BOOKING_STATUS_ABSENT = "absent";
export const BOOKING_STATUS_REFUNDED = "refunded";
export const BOOKING_STATUS_TOO_LATE = "tooLate";

export const BOOKING_ACTION_MAKES_BOOKING = "makesBooking";
export const BOOKING_ACTION_MAKES_CANCELLATION = "makesCancellation";

export const BOOKING_OCCURENCE_ANY_BOOKING = "anyBooking";
export const BOOKING_OCCURENCE_SPECIFIC_AMOUNT = "specificAmount";

export type BookingAction =
  | typeof BOOKING_ACTION_MAKES_BOOKING
  | typeof BOOKING_ACTION_MAKES_CANCELLATION;
export type BookingStatus =
  | typeof BOOKING_STATUS_PRESENT
  | typeof BOOKING_STATUS_ABSENT
  | typeof BOOKING_STATUS_REFUNDED
  | typeof BOOKING_STATUS_TOO_LATE;
export type BookingOccurrenceType =
  | typeof BOOKING_OCCURENCE_ANY_BOOKING
  | typeof BOOKING_OCCURENCE_SPECIFIC_AMOUNT;

export const BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND: Record<
  BookingStatus,
  number
> = {
  [BOOKING_STATUS_PRESENT]: 3,
  [BOOKING_STATUS_ABSENT]: 4,
  [BOOKING_STATUS_REFUNDED]: 5,
  [BOOKING_STATUS_TOO_LATE]: 6,
};

export const BOOKING_TEMPORALITY_BEFORE = "before";
export const BOOKING_TEMPORALITY_AFTER = "after";

export const BOOKING_TIME_UNIT_HOUR = "hour";
export const BOOKING_TIME_UNIT_DAY = "day";

export type BookingTemporality =
  | typeof BOOKING_TEMPORALITY_BEFORE
  | typeof BOOKING_TEMPORALITY_AFTER;

export type BookingTimeUnit =
  | typeof BOOKING_TIME_UNIT_HOUR
  | typeof BOOKING_TIME_UNIT_DAY;
