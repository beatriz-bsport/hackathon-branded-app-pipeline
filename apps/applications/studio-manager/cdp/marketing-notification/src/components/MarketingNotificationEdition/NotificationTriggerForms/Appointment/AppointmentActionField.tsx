import { RadioGroup } from "@bsport/kaizen-primitive-core";

import {
  APPOINTMENT_ACTION_ATTEND,
  APPOINTMENT_ACTION_CANCEL_ON_TIME,
  APPOINTMENT_ACTION_MAKES_CANCEL_TOO_LATE,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Appointment/types";
import { useTranslation } from "#src/utils/i18n";

type AppointmentActionFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AppointmentActionField = ({
  value,
  onChange,
}: AppointmentActionFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <RadioGroup
      required
      id="appointment-notification-trigger-action-field"
      label={t("steps.notificationRules.appointment.actionLabel")}
      options={[
        {
          value: APPOINTMENT_ACTION_ATTEND,
          label: t("steps.notificationRules.appointment.actions.attend"),
        },
        {
          value: APPOINTMENT_ACTION_CANCEL_ON_TIME,
          label: t("steps.notificationRules.appointment.actions.cancelOnTime"),
        },
        {
          value: APPOINTMENT_ACTION_MAKES_CANCEL_TOO_LATE,
          label: t("steps.notificationRules.appointment.actions.cancelTooLate"),
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
};
