import { Body, Divider, ToggleButton } from "@bsport/kaizen-primitive-core";

import { useFetchCompanyInformations } from "#src/hooks/api/use-fetch-company-informations";
import { useTogglePushNotification } from "#src/hooks/api/use-toggle-push-notification";
import { useUpdateNotificationRule } from "#src/hooks/api/use-update-notification-rule";
import { useTranslation } from "#src/utils/i18n";
import {
  getIsPushNotificationChecked,
  getIsPushNotificationDisabled,
} from "#src/utils/notificationRuleDetails";
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
  const isPushNotificationChecked = getIsPushNotificationChecked({
    refinedNotificationRuleData: selectedNotificationRule,
  });
  const isPushNotificationDisabled = getIsPushNotificationDisabled({
    refinedNotificationRuleData: selectedNotificationRule,
  });
  const { t } = useTranslation("transactionalNotification");
  const { togglePushNotification } = useTogglePushNotification({
    onSuccess: fetchNotificationRuleEventData,
  });
  const { companyName, companyLocale } = useFetchCompanyInformations();
  const {
    createPushNotificationContentInNotification,
    updatePushNotificationContentInNotification,
  } = useUpdateNotificationRule({
    notificationEventId: selectedNotificationEventId,
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
          if (!selectedNotificationRule) {
            return;
          }

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
      <div className="flex flex-row items-center justify-between">
        <Body htmlVariant="span" size="lg">
          {t("notificationRuleEventDetails.details.notificationStatus")}
        </Body>
        <ToggleButton
          key={`push-checkbox-action-${selectedNotificationEventId}-${isPushNotificationChecked ? "checked" : "unchecked"}`}
          id={`push-checkbox-action-${selectedNotificationEventId}`}
          size="md"
          checked={isPushNotificationChecked}
          disabled={isPushNotificationDisabled}
          onChange={({ checked }) => {
            if (!selectedNotificationRule?.details) {
              return;
            }

            togglePushNotification({
              notificationEventDetails: selectedNotificationRule.details,
              checked,
            });
          }}
          checkedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.activated",
            ),
            icon: "check",
          }}
          uncheckedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.deactivated",
            ),
          }}
        />
      </div>
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
