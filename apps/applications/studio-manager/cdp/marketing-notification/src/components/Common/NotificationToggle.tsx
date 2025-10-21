import { Body, ToggleButton } from "@bsport/kaizen-primitive-core";

import { useToggleMarketingNotification } from "#src/hooks/api/use-toggle-marketing-notification";
import { useTranslation } from "#src/utils/i18n";

type NotificationToggleProps = {
  isEmailNotificationBroken: boolean;
  isActive: boolean;
  disabled: boolean;
  notificationId: number;
};

export const NotificationToggle = ({
  isEmailNotificationBroken,
  isActive,
  disabled,
  notificationId,
}: NotificationToggleProps) => {
  const { handleToggleMarketingNotification } =
    useToggleMarketingNotification();
  const { t } = useTranslation("marketingNotificationList");
  if (isEmailNotificationBroken) {
    return (
      <Body size="md" weight="strong" htmlVariant="p" color="critical">
        {t("table.notificationState.broken")}
      </Body>
    );
  }
  return (
    <ToggleButton
      id={`marketing-notification-checkbox-action-${notificationId}`}
      size="md"
      checked={isActive}
      disabled={disabled}
      onChange={({ event, checked }) => {
        event.stopPropagation();
        handleToggleMarketingNotification({
          notificationId,
          checked,
        });
      }}
      checkedConfig={{
        label: t("table.notificationState.enabled"),
        icon: "check",
      }}
      uncheckedConfig={{
        label: t("table.notificationState.disabled"),
      }}
    />
  );
};
