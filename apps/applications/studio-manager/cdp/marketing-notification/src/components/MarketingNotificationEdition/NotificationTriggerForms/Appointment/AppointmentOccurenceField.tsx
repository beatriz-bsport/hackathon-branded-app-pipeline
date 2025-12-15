import { FormField } from "@bsport/form";
import { FormRadioGroup, TextField } from "@bsport/kaizen-primitive-core";

import type { AppointmentAction } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Appointment/types";
import {
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";
import { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";

type AppointmentOccurrenceFieldProps = {
  selectedAppointmentAction: AppointmentAction;
  amount: number;
  value: string;
  onAmountChange: (newValue: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AppointmentOccurrenceField = ({
  selectedAppointmentAction,
  amount,
  value,
  onAmountChange,
  onChange,
}: AppointmentOccurrenceFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const appoitnmentOccurenceTranslationKeyActionBased: "attend" | "cancel" =
    selectedAppointmentAction === "attend" ? "attend" : "cancel";

  return (
    <FormRadioGroup
      required
      id="booking-notification-trigger-occurrence-field"
      label={t("steps.notificationRules.appointment.occurrenceLabel")}
      options={[
        {
          value: BOOKING_OCCURENCE_ANY_BOOKING,
          label: t(
            `steps.notificationRules.appointment.occurrences.${appoitnmentOccurenceTranslationKeyActionBased}.anyBooking`,
          ),
        },
        {
          value: BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
          label: t(
            `steps.notificationRules.appointment.occurrences.${appoitnmentOccurenceTranslationKeyActionBased}.specificAmount`,
          ),
          element: (
            <FormField<
              BookingTriggerConfigValidationFormData,
              "bookingOccurrence"
            >
              name="bookingOccurrence"
              mapProps={({ defaultProps }) => ({
                ...defaultProps,
                value: String(amount),
                disabled: value === BOOKING_OCCURENCE_ANY_BOOKING,
                min: MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
                onChange: (event) => onAmountChange(Number(event.target.value)),
              })}
            >
              <TextField
                id="booking-amount-field"
                type="number"
                suffix={{
                  type: "text",
                  value: t(
                    `steps.notificationRules.appointment.amountSuffix.${appoitnmentOccurenceTranslationKeyActionBased}`,
                  ),
                }}
              />
            </FormField>
          ),
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
};
