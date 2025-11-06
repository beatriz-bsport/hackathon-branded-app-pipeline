import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { Alert, Body, Button } from "@bsport/kaizen-primitive-core";

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
import type { TriggerConfigValidationFormData } from "#src/utils/schemas/types";

const BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE = 0;

interface BookingOccurrence {
  occurrenceType: BookingOccurrenceType;
  amount: number;
}

type BookingNotificationTriggerFieldProps = Omit<
  ControlledFormProps<TriggerConfigValidationFormData>,
  "children"
>;

export const BookingNotificationTriggerField = ({
  ...methods
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

  return (
    <div className="flex flex-col gap-sm">
      <BookingActionField
        value={selectedBookingAction}
        onChange={(event) => {
          const newValue = event.target.value;
          console.log("new value : ", newValue);
          if (isValidBookingAction(newValue)) {
            setSelectedBookingAction(newValue);
            if (newValue === BOOKING_ACTION_MAKES_BOOKING) {
              setSelectedBookingStatus(BOOKING_STATUS_PRESENT);
              methods.setValue(
                "notificationKind",
                BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[
                  BOOKING_STATUS_PRESENT
                ],
                { shouldValidate: true },
              );
            } else {
              setSelectedBookingStatus(BOOKING_STATUS_REFUNDED);
              methods.setValue(
                "notificationKind",
                BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[
                  BOOKING_STATUS_REFUNDED
                ],
                { shouldValidate: true },
              );
            }
          } else {
            console.warn(
              "[Marketing Notification Creation Modal] - booking action selected not valid",
            );
          }
        }}
      />
      <BookingStatusField
        selectedBookingAction={selectedBookingAction}
        value={selectedBookingStatus}
        onChange={(event) => {
          const newNotificationStatus = event.target.value;
          if (isValidBookingStatus(newNotificationStatus)) {
            const newNotificationKind =
              BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[newNotificationStatus];
            setSelectedBookingStatus(newNotificationStatus);
            methods.setValue("notificationKind", newNotificationKind, {
              shouldValidate: true,
            });
          } else {
            console.warn(
              "[Marketing Notification Creation Modal] - booking status selected not valid",
            );
          }
        }}
      />

      <Alert type="weak" status="default">
        <Body htmlVariant="p" size="md">
          {t(`steps.notificationRules.booking.alerts.${selectedBookingStatus}`)}
        </Body>
      </Alert>

      <BookingOccurrenceField
        value={selectedBookingOccurrence.occurrenceType}
        amount={selectedBookingOccurrence.amount}
        onChange={(event) => {
          const newValue = event.target.value;
          if (isValidBookingOccurenceType(newValue)) {
            setSelectedBookingOccurrence((prev) => ({
              ...prev,
              occurrenceType: newValue,
            }));
            if (newValue === BOOKING_OCCURENCE_ANY_BOOKING) {
              methods.setValue(
                "eventOccurrence",
                BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE,
                {
                  shouldValidate: true,
                },
              );
            } else if (newValue === BOOKING_OCCURENCE_SPECIFIC_AMOUNT) {
              methods.setValue(
                "eventOccurrence",
                selectedBookingOccurrence.amount,
                {
                  shouldValidate: true,
                },
              );
            }
          } else {
            console.warn(
              "[Marketing Notification Creation Modal] - booking occurence type selected not valid",
            );
          }
        }}
        onAmountChange={(newAmount) => {
          methods.setValue("eventOccurrence", Number(newAmount), {
            shouldValidate: true,
          });
          setSelectedBookingOccurrence((prev) => ({
            ...prev,
            amount: Number(newAmount),
          }));
        }}
      />
      <Button
        intent="call-to-action"
        color="main"
        size="md"
        label="Check form"
        onClick={() => console.log("form values : ", methods.getValues())}
      />
    </div>
  );
};
