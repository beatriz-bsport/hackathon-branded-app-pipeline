import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookingActionField = ({ value, onChange }: Props) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <RadioGroup
      required
      id="booking-notification-trigger-action-field"
      label={t("steps.notificationRules.booking.actionLabel")}
      options={[
        {
          value: "makesBooking",
          label: t("steps.notificationRules.booking.actions.makesBooking"),
        },
        {
          value: "makesCancellation",
          label: t("steps.notificationRules.booking.actions.makesCancellation"),
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
};
