import type {
  BookingAction,
  BookingOccurrenceType,
  BookingStatus,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";

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
