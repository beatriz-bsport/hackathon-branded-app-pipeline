import { ToggleButton } from "@bsport/kaizen-primitive-core";

import { useToggleMarketingNotification } from "#src/hooks/api/use-toggle-marketing-notification";
import { useTranslation } from "#src/utils/i18n";

type NotificationToggleProps = {
  isActive: boolean;
  notificationId: number;
  isEmailTemplateMissing: boolean;
  isPushNotificationSet: boolean;
  isUserMarketingNotificationManager: boolean;
};

export const NotificationToggle = ({
  isActive,
  isEmailTemplateMissing,
  isPushNotificationSet,
  isUserMarketingNotificationManager,
  notificationId,
}: NotificationToggleProps) => {
  const { handleToggleMarketingNotification } =
    useToggleMarketingNotification();
  const { t } = useTranslation("marketingNotificationList");
  const disabled =
    !isUserMarketingNotificationManager ||
    (isEmailTemplateMissing && !isPushNotificationSet && !isActive);
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
