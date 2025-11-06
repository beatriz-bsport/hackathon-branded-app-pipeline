import {
  RadioGroup,
  type RadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import type { BookingAction } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { useTranslation } from "#src/utils/i18n";

interface Props {
  selectedBookingAction: BookingAction;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookingStatusField = ({
  selectedBookingAction,
  value,
  onChange,
}: Props) => {
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
              value: "present",
              label: t("steps.notificationRules.booking.statusOptions.present"),
            },
            {
              value: "absent",
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
              value: "refunded",
              label: t(
                "steps.notificationRules.booking.statusOptions.refunded",
              ),
            },
            {
              value: "tooLate",
              label: t("steps.notificationRules.booking.statusOptions.tooLate"),
            },
          ],
          value,
          onChange: onChange,
        };
  return <RadioGroup {...statusRadioGroupProps} />;
};
