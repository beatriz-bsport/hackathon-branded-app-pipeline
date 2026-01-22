import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";

import { AppointmentActionField } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/AppointmentActionField";
import { AppointmentOccurrenceField } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/AppointmentOccurenceField";
import {
  APPOINTMENT_ACTIONS_EVENT_KIND,
  APPOINTMENT_ACTIONS_MAP_TO_APPOINTMENT_EVENT_KIND,
  APPOINTMENT_ACTION_ATTEND,
  APPOINTMENT_EVENT_KIND_MAP_TO_APPOINTMENT_ACTIONS,
  type AppointmentAction,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/types";
import { isValidAppointmentAction } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/utils";
import {
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_ANY_BOOKING_FORM_VALUE,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  type BookingOccurrenceType,
  MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import { isValidBookingOccurenceType } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/utils";
import type { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";

interface BookingOccurrence {
  occurrenceType: BookingOccurrenceType;
  amount: number;
}

type AppointmentNotificationTriggerFieldProps = {
  setFormValue: ControlledFormProps<BookingTriggerConfigValidationFormData>["setValue"];
  defaultAppointmentStatus: number;
  defaultAppointmentOccurence: number;
};

export const AppointmentNotificationTriggerField = ({
  setFormValue,
  defaultAppointmentOccurence,
  defaultAppointmentStatus,
}: AppointmentNotificationTriggerFieldProps) => {
  const [selectedAppointmentAction, setSelectedAppointmentAction] =
    useState<AppointmentAction>(
      APPOINTMENT_ACTIONS_EVENT_KIND.includes(defaultAppointmentStatus)
        ? APPOINTMENT_EVENT_KIND_MAP_TO_APPOINTMENT_ACTIONS[
            defaultAppointmentStatus
          ]
        : APPOINTMENT_ACTION_ATTEND,
    );
  const [selectedAppointmentOccurrence, setSelectedAppointmentOccurrence] =
    useState<BookingOccurrence>({
      occurrenceType:
        defaultAppointmentOccurence > 0
          ? BOOKING_OCCURENCE_SPECIFIC_AMOUNT
          : BOOKING_OCCURENCE_ANY_BOOKING,
      amount: defaultAppointmentOccurence,
    });

  const handleAppointmentActionUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAction = event.target.value;
    if (!isValidAppointmentAction(newAction)) {
      console.warn(
        "[Marketing Notification Modal] - Appointment action type do not have a valid value",
      );
      return;
    }
    setFormValue(
      "bookingEventKind",
      APPOINTMENT_ACTIONS_MAP_TO_APPOINTMENT_EVENT_KIND[newAction],
      {
        shouldValidate: true,
      },
    );
    setSelectedAppointmentAction(newAction);
  };

  const handleAppointmentOccurenceTypeUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newOccurenceType = event.target.value;
    let occurenceValue = selectedAppointmentOccurrence.amount;
    if (!isValidBookingOccurenceType(newOccurenceType)) {
      console.warn(
        "[Marketing Notification Modal] - Appointment occurence type do not have a valid value",
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
    setSelectedAppointmentOccurrence({
      occurrenceType: newOccurenceType,
      amount: occurenceValue,
    });
  };

  const handleBookingOccurenceAmountUpdate = (newAmount: number) => {
    setFormValue("bookingOccurrence", Number(newAmount), {
      shouldValidate: true,
    });
    setSelectedAppointmentOccurrence((prev) => ({
      ...prev,
      amount: Number(newAmount),
    }));
  };

  return (
    <div className="flex flex-col gap-sm">
      <AppointmentActionField
        value={selectedAppointmentAction}
        onChange={handleAppointmentActionUpdate}
      />
      <AppointmentOccurrenceField
        amount={selectedAppointmentOccurrence.amount}
        selectedAppointmentAction={selectedAppointmentAction}
        value={selectedAppointmentOccurrence.occurrenceType}
        onChange={handleAppointmentOccurenceTypeUpdate}
        onAmountChange={handleBookingOccurenceAmountUpdate}
      />
    </div>
  );
};
