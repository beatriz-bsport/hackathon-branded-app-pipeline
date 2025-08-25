import { FC } from "react";

import { SegmentedControl, Title } from "@bsport/kaizen-primitive-core";

import { NotificationRuleEmailNotificationDetails } from "#src/components/NotificationRuleEventDetail/NotificationRuleEmailNotificationDetails";
import { useFetchNotificationRuleEventGroupDetails } from "#src/hooks/api/use-fetch-notification-rule-event-group-details";
import { useTranslation } from "#src/utils/i18n";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

type NotificationRuleDetailsContentProps = {
  eventGroupIdentifier: string;
  selectedNotificationEventId: number;
  selectedNotificationRule: RefinedNotificationRuleEventData | null;
  getNotificationRuleEventLabel: (notificationEventId: number) => string;
  toggleEmailCarbonCopy: (params: {
    checked: boolean;
    notificationEventId: number;
  }) => void;
};

export const NotificationRuleDetailsContent: FC<
  NotificationRuleDetailsContentProps
> = ({
  eventGroupIdentifier,
  selectedNotificationEventId,
  selectedNotificationRule,
  getNotificationRuleEventLabel,
  toggleEmailCarbonCopy,
}: NotificationRuleDetailsContentProps) => {
  const { t } = useTranslation("transactionalNotification");
  const { fetchNotificationRuleEventData } =
    useFetchNotificationRuleEventGroupDetails({ eventGroupIdentifier });

  if (!selectedNotificationRule || !selectedNotificationRule?.rule) {
    return null;
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h3" weight="strong">
          {selectedNotificationRule?.rule?.notification_event
            ? getNotificationRuleEventLabel(
                selectedNotificationRule?.rule?.notification_event,
              )
            : ""}
        </Title>
        <SegmentedControl
          fullWidth
          id="notification-rule-communication-type"
          className="h-xl"
          options={[
            {
              value: "email_notification",
              label: t(
                "notificationRuleEventDetails.details.segmentedControl.email",
              ),
            },
            {
              value: "push_notification",
              label: t(
                "notificationRuleEventDetails.details.segmentedControl.push",
              ),
            },
          ]}
        />
        <NotificationRuleEmailNotificationDetails
          emailDesignId={
            selectedNotificationRule?.details?.email_design ?? null
          }
          selectedNotificationEventId={selectedNotificationEventId}
          selectedNotificationRule={selectedNotificationRule}
          fetchNotificationRuleEventData={fetchNotificationRuleEventData}
          toggleEmailCarbonCopy={toggleEmailCarbonCopy}
        />
      </div>
    </div>
  );
};
