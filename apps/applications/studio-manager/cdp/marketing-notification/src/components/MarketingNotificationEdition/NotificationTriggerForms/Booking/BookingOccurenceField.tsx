import { FormField } from "@bsport/form";
import { FormRadioGroup, TextField } from "@bsport/kaizen-primitive-core";

import {
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";
import type { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";

/**
 * This value differs from the base value because the bookingOccurrence field can be set
 * to 0 to send a notification for every event. However, in this case, the minimum should be 1,
 * since at least one event must occur to trigger the notification. A value of 0 wouldn’t make sense here.
 */
const SPECIFIC_AMOUNT_SELECTOR_MIN_VALUE = 1;

type BookingOccurrenceFieldProps = {
  amount: number;
  value: string;
  onAmountChange: (newValue: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BookingOccurrenceField = ({
  amount,
  value,
  onAmountChange,
  onChange,
}: BookingOccurrenceFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <FormRadioGroup
      required
      id="booking-notification-trigger-occurrence-field"
      label={t("steps.notificationRules.booking.occurrenceLabel")}
      options={[
        {
          value: BOOKING_OCCURENCE_ANY_BOOKING,
          label: t("steps.notificationRules.booking.occurrences.anyBooking"),
        },
        {
          value: BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
          label: t(
            "steps.notificationRules.booking.occurrences.specificAmount",
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
                min: SPECIFIC_AMOUNT_SELECTOR_MIN_VALUE,
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
      onChange={onChange}
    />
  );
};
