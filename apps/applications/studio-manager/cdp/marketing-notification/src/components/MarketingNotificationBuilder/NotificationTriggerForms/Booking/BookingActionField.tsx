import { RadioGroup } from "@bsport/kaizen-primitive-core";

import {
  BOOKING_ACTION_MAKES_BOOKING,
  BOOKING_ACTION_MAKES_CANCELLATION,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";

type BookingActionFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BookingActionField = ({
  value,
  onChange,
}: BookingActionFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <RadioGroup
      required
      id="booking-notification-trigger-action-field"
      label={t("steps.notificationRules.booking.actionLabel")}
      options={[
        {
          value: BOOKING_ACTION_MAKES_BOOKING,
          label: t("steps.notificationRules.booking.actions.makesBooking"),
        },
        {
          value: BOOKING_ACTION_MAKES_CANCELLATION,
          label: t("steps.notificationRules.booking.actions.makesCancellation"),
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
};
