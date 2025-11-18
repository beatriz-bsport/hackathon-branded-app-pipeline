import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { Alert, Body } from "@bsport/kaizen-primitive-core";

import { BookingActionField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingActionField";
import { BookingOccurrenceField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingOccurenceField";
import { BookingStatusField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingStatusField";
import {
  BOOKING_ACTION_MAKES_BOOKING,
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_STATUS_REFUNDED,
  type BookingAction,
  type BookingOccurrenceType,
  type BookingStatus,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import {
  isValidBookingAction,
  isValidBookingOccurenceType,
  isValidBookingStatus,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/utils";
import { useTranslation } from "#src/utils/i18n";
import type { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";

const BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE = 0;
export const MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT = 1;

interface BookingOccurrence {
  occurrenceType: BookingOccurrenceType;
  amount: number;
}

type BookingNotificationTriggerFieldProps = {
  setFormValue: ControlledFormProps<BookingTriggerConfigValidationFormData>["setValue"];
};

export const BookingNotificationTriggerField = ({
  setFormValue,
}: BookingNotificationTriggerFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const [selectedBookingAction, setSelectedBookingAction] =
    useState<BookingAction>(BOOKING_ACTION_MAKES_BOOKING);
  const [selectedBookingStatus, setSelectedBookingStatus] =
    useState<BookingStatus>(BOOKING_STATUS_PRESENT);
  const [selectedBookingOccurrence, setSelectedBookingOccurrence] =
    useState<BookingOccurrence>({
      occurrenceType: BOOKING_OCCURENCE_ANY_BOOKING,
      amount: 0,
    });

  const handleBookingActionUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAction = event.target.value;
    if (!isValidBookingAction(newAction)) {
      console.warn(
        "[Marketing Notification Modal] - Booking action do not have a valid type",
      );
      return;
    }
    if (newAction === BOOKING_ACTION_MAKES_BOOKING) {
      setSelectedBookingStatus(BOOKING_STATUS_PRESENT);
      setFormValue(
        "bookingEventKind",
        BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_PRESENT],
        { shouldValidate: true },
      );
    } else {
      setSelectedBookingStatus(BOOKING_STATUS_REFUNDED);
      setFormValue(
        "bookingEventKind",
        BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_REFUNDED],
        { shouldValidate: true },
      );
    }
    setSelectedBookingAction(newAction);
  };

  const handleBookingStatusUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newStatus = event.target.value;
    if (!isValidBookingStatus(newStatus)) {
      console.warn(
        "[Marketing Notification Modal] - Booking status do not have a valid type",
      );
      return;
    }
    const newNotificationKind =
      BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[newStatus];
    setSelectedBookingStatus(newStatus);
    setFormValue("bookingEventKind", newNotificationKind, {
      shouldValidate: true,
    });
  };

  const handleBookingOccurenceTypeUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newOccurenceType = event.target.value;
    let occurenceValue = selectedBookingOccurrence.amount;
    if (!isValidBookingOccurenceType(newOccurenceType)) {
      console.warn(
        "[Marketing Notification Modal] - Booking occurence type do not have a valid type",
      );
      return;
    }
    if (newOccurenceType === BOOKING_OCCURENCE_ANY_BOOKING) {
      setFormValue(
        "bookingOccurrence",
        BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE,
        {
          shouldValidate: true,
        },
      );
    } else if (newOccurenceType === BOOKING_OCCURENCE_SPECIFIC_AMOUNT) {
      occurenceValue =
        occurenceValue === BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE
          ? MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT
          : occurenceValue;
      setFormValue("bookingOccurrence", occurenceValue, {
        shouldValidate: true,
      });
    }
    setSelectedBookingOccurrence({
      occurrenceType: newOccurenceType,
      amount: occurenceValue,
    });
  };

  const handleBookingOccurenceAmountUpdate = (newAmount: number) => {
    setFormValue("bookingOccurrence", Number(newAmount), {
      shouldValidate: true,
    });
    setSelectedBookingOccurrence((prev) => ({
      ...prev,
      amount: Number(newAmount),
    }));
  };

  return (
    <div className="flex flex-col gap-sm">
      <BookingActionField
        value={selectedBookingAction}
        onChange={handleBookingActionUpdate}
      />
      <BookingStatusField
        selectedBookingAction={selectedBookingAction}
        value={selectedBookingStatus}
        onChange={handleBookingStatusUpdate}
      />

      <Alert type="weak" status="default">
        <Body htmlVariant="p" size="md">
          {t(`steps.notificationRules.booking.alerts.${selectedBookingStatus}`)}
        </Body>
      </Alert>

      <BookingOccurrenceField
        value={selectedBookingOccurrence.occurrenceType}
        amount={selectedBookingOccurrence.amount}
        onChange={handleBookingOccurenceTypeUpdate}
        onAmountChange={handleBookingOccurenceAmountUpdate}
      />
    </div>
  );
};
