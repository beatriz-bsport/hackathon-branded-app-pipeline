import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { Alert, Body } from "@bsport/kaizen-primitive-core";

import { BookingActionField } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/BookingActionField";
import { BookingOccurrenceField } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/BookingOccurenceField";
import { BookingStatusField } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/BookingStatusField";
import {
  BOOKING_ACTION_MAKES_BOOKING,
  BOOKING_ACTION_MAKES_CANCELLATION,
  BOOKING_CANCELLATIONS_EVENT_KIND,
  BOOKING_EVENT_KIND_MAP_TO_BOOKING_STATUS,
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_STATUS_REFUNDED,
  type BookingAction,
  type BookingOccurrenceType,
  type BookingStatus,
  MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import {
  isValidBookingAction,
  isValidBookingOccurenceType,
  isValidBookingStatus,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/utils";
import { useTranslation } from "#src/utils/i18n";
import type { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";

interface BookingOccurrence {
  occurrenceType: BookingOccurrenceType;
  amount: number;
}

type BookingNotificationTriggerFieldProps = {
  setFormValue: ControlledFormProps<BookingTriggerConfigValidationFormData>["setValue"];
  defaultBookingStatus: number;
  defaultBookingOccurence: number;
};

export const BookingNotificationTriggerField = ({
  defaultBookingStatus,
  defaultBookingOccurence,
  setFormValue,
}: BookingNotificationTriggerFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const [selectedBookingAction, setSelectedBookingAction] =
    useState<BookingAction>(
      BOOKING_CANCELLATIONS_EVENT_KIND.includes(defaultBookingStatus)
        ? BOOKING_ACTION_MAKES_CANCELLATION
        : BOOKING_ACTION_MAKES_BOOKING,
    );
  const [selectedBookingStatus, setSelectedBookingStatus] =
    useState<BookingStatus>(
      BOOKING_EVENT_KIND_MAP_TO_BOOKING_STATUS[defaultBookingStatus] ??
        BOOKING_STATUS_PRESENT,
    );
  const [selectedBookingOccurrence, setSelectedBookingOccurrence] =
    useState<BookingOccurrence>({
      occurrenceType:
        defaultBookingOccurence > 0
          ? BOOKING_OCCURENCE_SPECIFIC_AMOUNT
          : BOOKING_OCCURENCE_ANY_BOOKING,
      amount: defaultBookingOccurence ?? 0,
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
    setFormValue("bookingActionType", newAction);
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
    setFormValue("bookingOccurrenceType", newOccurenceType);
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

      {selectedBookingAction === BOOKING_ACTION_MAKES_BOOKING ? (
        <Alert type="weak" status="default">
          <Body htmlVariant="p" size="md">
            {t(`steps.notificationRules.booking.alerts.defaultToAbsent`)}
          </Body>
        </Alert>
      ) : null}

      <BookingOccurrenceField
        bookingAction={selectedBookingAction}
        value={selectedBookingOccurrence.occurrenceType}
        amount={selectedBookingOccurrence.amount}
        onChange={handleBookingOccurenceTypeUpdate}
        onAmountChange={handleBookingOccurenceAmountUpdate}
      />
    </div>
  );
};
