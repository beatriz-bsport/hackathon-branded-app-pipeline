import {
  RadioGroup,
  type RadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import {
  BOOKING_STATUS_ABSENT,
  BOOKING_STATUS_PRESENT,
  BOOKING_STATUS_REFUNDED,
  BOOKING_STATUS_TOO_LATE,
  type BookingAction,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";

type BookingStatusFieldProps = {
  selectedBookingAction: BookingAction;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BookingStatusField = ({
  selectedBookingAction,
  value,
  onChange,
}: BookingStatusFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const statusRadioGroupProps: RadioGroupProps =
    selectedBookingAction === "makesBooking"
      ? {
          key: "booking-status-options",
          required: true,
          id: "booking-notification-trigger-status-field",
          label: t("steps.notificationRules.booking.statusLabel.attendance"),
          options: [
            {
              value: BOOKING_STATUS_PRESENT,
              label: t("steps.notificationRules.booking.statusOptions.present"),
            },
            {
              value: BOOKING_STATUS_ABSENT,
              label: t("steps.notificationRules.booking.statusOptions.absent"),
            },
          ],
          value,
          onChange: onChange,
        }
      : {
          key: "cancellation-status-options",
          required: true,
          id: "booking-notification-trigger-status-field",
          label: t("steps.notificationRules.booking.statusLabel.cancellation"),
          options: [
            {
              value: BOOKING_STATUS_REFUNDED,
              label: t(
                "steps.notificationRules.booking.statusOptions.refunded",
              ),
            },
            {
              value: BOOKING_STATUS_TOO_LATE,
              label: t("steps.notificationRules.booking.statusOptions.tooLate"),
            },
          ],
          value,
          onChange: onChange,
        };
  return <RadioGroup {...statusRadioGroupProps} />;
};
