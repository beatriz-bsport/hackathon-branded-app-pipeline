import type {
  BookingAction,
  BookingOccurrenceType,
  BookingStatus,
  BookingTemporality,
  BookingTimeUnit,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";

export function isValidBookingStatus(status: string): status is BookingStatus {
  return (
    status === "present" ||
    status === "absent" ||
    status === "refunded" ||
    status === "tooLate"
  );
}

export function isValidBookingAction(action: string): action is BookingAction {
  return action === "makesBooking" || action === "makesCancellation";
}

export function isValidBookingOccurenceType(
  occurenceType: string,
): occurenceType is BookingOccurrenceType {
  return occurenceType === "anyBooking" || occurenceType === "specificAmount";
}

export function isTimeUnitTypeCorrect(
  timeUnit: string,
): timeUnit is BookingTimeUnit {
  return timeUnit === "hour" || timeUnit === "day";
}

export function isTemporalityTypeCorrect(
  timeUnit: string,
): timeUnit is BookingTemporality {
  return timeUnit === "before" || timeUnit === "after";
}
