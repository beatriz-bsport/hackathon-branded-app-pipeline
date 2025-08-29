import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useFetchCompanyInformations } from "#src/hooks/api/use-fetch-company-informations";
import { useUpdateNotificationRule } from "#src/hooks/api/use-update-notification-rule";
import { useTranslation } from "#src/utils/i18n";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

import { PushNotificationPreview } from "../PreviewComponents/PushNotificationPreview";
import { NotificationRulePushNotificationForm } from "./NotificationRulePushNotificationForm";

type NotificationRulePushNotificationDetailsProps = {
  selectedNotificationEventId: number;
  selectedNotificationRule: RefinedNotificationRuleEventData;
  fetchNotificationRuleEventData: () => void;
};

export const NotificationRulePushNotificationDetails: React.FC<
  NotificationRulePushNotificationDetailsProps
> = ({
  selectedNotificationEventId,
  selectedNotificationRule,
  fetchNotificationRuleEventData,
}: NotificationRulePushNotificationDetailsProps) => {
  const { t } = useTranslation("transactionalNotification");
  const { companyName, companyLocale } = useFetchCompanyInformations();
  const {
    createPushNotificationContentInNotification,
    updatePushNotificationContentInNotification,
  } = useUpdateNotificationRule({
    notificationEventId: selectedNotificationEventId,
    notificationEventDetails: selectedNotificationRule?.details,
    onSuccess: () => {
      fetchNotificationRuleEventData();
    },
  });

  return (
    <div className="flex flex-col gap-md">
      <NotificationRulePushNotificationForm
        pushNotificationTitle={
          selectedNotificationRule?.details?.push_notification_title || ""
        }
        pushNotificationContent={
          selectedNotificationRule?.details?.push_notification_content || ""
        }
        updatePushNotificationContentInNotification={({ title, content }) => {
          if (!selectedNotificationRule) return;
          if (!selectedNotificationRule.details) {
            createPushNotificationContentInNotification({
              title,
              content,
            });
          } else {
            updatePushNotificationContentInNotification({
              notificationEventDetails: selectedNotificationRule.details,
              title,
              content,
            });
          }
        }}
      />
      <Divider orientation="horizontal" weight="thin" />
      <div className="flex flex-col gap-xs">
        <Body className="place-self-center" htmlVariant="span" weight="strong">
          {t("notificationRuleEventDetails.table.actions.preview")}
        </Body>
      </div>
      <PushNotificationPreview
        title={selectedNotificationRule?.details?.push_notification_title || ""}
        content={
          selectedNotificationRule?.details?.push_notification_content || ""
        }
        sender={companyName || ""}
        noContentMessage={t(
          "notificationRuleEventDetails.details.pushNotification.preview.placeholder",
        )}
        dateTime={new Date().toLocaleTimeString(companyLocale, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
};
