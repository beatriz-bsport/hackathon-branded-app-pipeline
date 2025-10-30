import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { Alert, Body, Button } from "@bsport/kaizen-primitive-core";

import { BookingActionField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingActionField";
import { BookingOccurrenceField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingOccurenceField";
import { BookingStatusField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingStatusField";
import {
  BOOKING_ACTION_MAKES_BOOKING,
  BOOKING_ACTION_MAKES_CANCELLATION,
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  BOOKING_STATUS_ABSENT,
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_STATUS_REFUNDED,
  BOOKING_STATUS_TOO_LATE,
  type BookingAction,
  type BookingOccurrenceType,
  type BookingStatus,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";
import type { TriggerConfigValidationFormData } from "#src/utils/schemas/types";

const BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE = 0;

interface BookingOccurrence {
  occurrenceType: BookingOccurrenceType;
  amount: number;
}

function reverseMap<T extends Record<string, string>>(
  obj: T,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key in obj) {
    out[obj[key]] = key;
  }
  return out;
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

  const bookingActionMappedToTranslations: Record<string, BookingAction> = {
    [t("steps.notificationRules.booking.actions.makesBooking")]:
      BOOKING_ACTION_MAKES_BOOKING,
    [t("steps.notificationRules.booking.actions.makesCancellation")]:
      BOOKING_ACTION_MAKES_CANCELLATION,
  };
  const bookingStatusMappedToTranslations: Record<string, BookingStatus> = {
    [t("steps.notificationRules.booking.statusOptions.present")]:
      BOOKING_STATUS_PRESENT,
    [t("steps.notificationRules.booking.statusOptions.absent")]:
      BOOKING_STATUS_ABSENT,
    [t("steps.notificationRules.booking.statusOptions.refunded")]:
      BOOKING_STATUS_REFUNDED,
    [t("steps.notificationRules.booking.statusOptions.tooLate")]:
      BOOKING_STATUS_TOO_LATE,
  };
  const bookingOccurencesMappedToTranslations: Record<
    string,
    BookingOccurrenceType
  > = {
    [t("steps.notificationRules.booking.occurrences.anyBooking")]:
      BOOKING_OCCURENCE_ANY_BOOKING,
    [t("steps.notificationRules.booking.occurrences.specificAmount")]:
      BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  };

  const translationsMappedToBookingActions = reverseMap(
    bookingActionMappedToTranslations,
  );

  const translationsMappedToBookingStatus = reverseMap(
    bookingStatusMappedToTranslations,
  );

  const translationsMappedToBookingOccurrences = reverseMap(
    bookingOccurencesMappedToTranslations,
  );

  return (
    <div className="flex flex-col gap-sm">
      <BookingActionField
        value={translationsMappedToBookingActions[selectedBookingAction]}
        onChange={(event) => {
          const newValue =
            bookingActionMappedToTranslations[event.target.value];
          if (newValue === BOOKING_ACTION_MAKES_BOOKING) {
            setSelectedBookingStatus(BOOKING_STATUS_PRESENT);
            methods.setValue(
              "notificationKind",
              BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_PRESENT],
              { shouldValidate: true },
            );
          } else {
            setSelectedBookingStatus(BOOKING_STATUS_REFUNDED);
            methods.setValue(
              "notificationKind",
              BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_REFUNDED],
              { shouldValidate: true },
            );
          }
          setSelectedBookingAction(newValue);
        }}
      />
      <BookingStatusField
        selectedBookingAction={selectedBookingAction}
        value={translationsMappedToBookingStatus[selectedBookingStatus]}
        onChange={(event) => {
          const newNotificationStatus =
            bookingStatusMappedToTranslations[event.target.value];
          const newNotificationKind =
            BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[newNotificationStatus];
          setSelectedBookingStatus(newNotificationStatus);
          methods.setValue("notificationKind", newNotificationKind, {
            shouldValidate: true,
          });
        }}
      />

      <Alert type="weak" status="default">
        <Body htmlVariant="p" size="md">
          {t(`steps.notificationRules.booking.alerts.${selectedBookingStatus}`)}
        </Body>
      </Alert>

      <BookingOccurrenceField
        value={
          translationsMappedToBookingOccurrences[
            selectedBookingOccurrence.occurrenceType
          ]
        }
        bookingOccurencesMappedToTranslations={
          bookingOccurencesMappedToTranslations
        }
        amount={selectedBookingOccurrence.amount}
        onChange={(event) => {
          const newValue =
            bookingOccurencesMappedToTranslations[event.target.value];
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
          setSelectedBookingOccurrence((prev) => ({
            ...prev,
            occurrenceType: newValue,
          }));
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
