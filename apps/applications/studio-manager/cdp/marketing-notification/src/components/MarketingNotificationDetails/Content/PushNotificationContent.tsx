import { Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { PushNotificationPreview } from "#src/components/MarketingNotificationDetails/Content/PushNotificationPreview";
import { useCompanyData } from "#src/hooks/api/use-company-data";
import { useTranslation } from "#src/utils/i18n";

type PushNotificationContentProps = {
  notification: MarketingNotification;
};

export const PushNotificationContent = ({
  notification,
}: PushNotificationContentProps) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const { userLocale, companyName } = useCompanyData();

  return (
    <div className="flex flex-col gap-sm">
      <Title htmlVariant="h3" weight="strong">
        {t("drawer.content.push.title")}
      </Title>
      <PushNotificationPreview
        title={notification.push_notification_title || ""}
        content={notification.push_notification_content || ""}
        sender={companyName || ""}
        noContentMessage={t("drawer.content.push.noPreview")}
        dateTime={new Date().toLocaleTimeString(userLocale, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
};
