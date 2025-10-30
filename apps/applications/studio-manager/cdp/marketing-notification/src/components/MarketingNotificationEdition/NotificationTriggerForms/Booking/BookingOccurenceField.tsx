import { FormField } from "@bsport/form";
import { FormRadioGroup, TextField } from "@bsport/kaizen-primitive-core";

import {
  BOOKING_OCCURENCE_ANY_BOOKING,
  type BookingOccurrenceType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";
import { TriggerConfigValidationFormData } from "#src/utils/schemas/types";

interface Props {
  amount: number;
  value: string;
  bookingOccurencesMappedToTranslations: Record<string, BookingOccurrenceType>;
  onAmountChange: (newValue: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookingOccurrenceField = ({
  amount,
  value,
  bookingOccurencesMappedToTranslations,
  onAmountChange,
  onChange,
}: Props) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <FormRadioGroup
      required
      id="booking-notification-trigger-occurrence-field"
      label={t("steps.notificationRules.booking.occurrenceLabel")}
      options={[
        {
          id: "any-booking",
          value: t("steps.notificationRules.booking.occurrences.anyBooking"),
        },
        {
          id: "specific-amount",
          value: t(
            "steps.notificationRules.booking.occurrences.specificAmount",
          ),
          element: (
            <FormField<TriggerConfigValidationFormData, "eventOccurrence">
              name="eventOccurrence"
              mapProps={({ defaultProps }) => ({
                ...defaultProps,
                value: String(amount),
                disabled:
                  bookingOccurencesMappedToTranslations[value] ===
                  BOOKING_OCCURENCE_ANY_BOOKING,
                min: 0,
                onChange: (event) => onAmountChange(Number(event.target.value)),
              })}
            >
              <TextField
                id="booking-amount-field"
                type="number"
                suffix={{
                  type: "text",
                  value: t("steps.notificationRules.booking.amountSuffix"),
                }}
              />
            </FormField>
          ),
        },
      ]}
      value={value}
      onChangeValue={onChange}
    />
  );
};
