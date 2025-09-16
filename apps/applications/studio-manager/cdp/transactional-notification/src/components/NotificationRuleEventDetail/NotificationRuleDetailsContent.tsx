import { useState } from "react";
import type { FC } from "react";
import { useSearchParams } from "react-router";

import { SegmentedControl, Title } from "@bsport/kaizen-primitive-core";

import { NotificationRuleEmailNotificationDetails } from "#src/components/NotificationRuleEventDetail/NotificationRuleEmailNotificationDetails";
import { useFetchNotificationRuleEventGroupDetails } from "#src/hooks/api/use-fetch-notification-rule-event-group-details";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import { useTranslation } from "#src/utils/i18n";
import type {
  RefinedNotificationRuleEventData,
  ToggleEmailNotificationMethodParams,
} from "#src/utils/types";

import { NotificationRulePushNotificationDetails } from "./NotificationRulePushNotificationDetails";

type NotificationRuleDetailsContentProps = {
  selectedNotificationEventId: number;
  selectedNotificationRule: RefinedNotificationRuleEventData | null;
  getNotificationRuleEventLabel: (notificationEventId: number) => string;
  toggleEmailCarbonCopy: (params: ToggleEmailNotificationMethodParams) => void;
  toggleEmailNotification: (
    params: ToggleEmailNotificationMethodParams,
  ) => void;
};

type NotificationSegments = "email_notification" | "push_notification";

function isNotificationSegment(value: string): value is NotificationSegments {
  return value === "email_notification" || value === "push_notification";
}

export const NotificationRuleDetailsContent: FC<
  NotificationRuleDetailsContentProps
> = ({
  selectedNotificationEventId,
  selectedNotificationRule,
  getNotificationRuleEventLabel,
  toggleEmailCarbonCopy,
  toggleEmailNotification,
}: NotificationRuleDetailsContentProps) => {
  const [searchParams] = useSearchParams();
  const { isPushNotificationEnabled } = useAvailableUpsells();
  const notificationType = searchParams.get("notificationType");
  const initialSegment: NotificationSegments =
    isPushNotificationEnabled &&
    notificationType &&
    isNotificationSegment(notificationType)
      ? notificationType
      : "email_notification";
  const [selectedOption, setSelectedOption] =
    useState<NotificationSegments>(initialSegment);

  const shouldBlockPushNotification =
    !isPushNotificationEnabled ||
    selectedNotificationRule?.settings?.disabled_checkboxes ||
    (selectedNotificationRule?.rule.required_tags || []).length > 0;

  const { t } = useTranslation("transactionalNotification");
  const { fetchNotificationRuleEventData } =
    useFetchNotificationRuleEventGroupDetails();

  const handleChangeSegmentedControl = (value: string) => {
    if (!isNotificationSegment(value)) return;
    setSelectedOption(value);
  };

  if (!selectedNotificationRule || !selectedNotificationRule?.rule) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h3" weight="strong">
          {selectedNotificationRule?.rule?.notification_event
            ? getNotificationRuleEventLabel(
                selectedNotificationRule?.rule?.notification_event,
              )
            : ""}
        </Title>
        {!shouldBlockPushNotification ? (
          <SegmentedControl
            fullWidth
            id="notification-rule-communication-type"
            className="h-xl"
            urlQueryParamName="notificationType"
            value={selectedOption}
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
            onChangeValue={handleChangeSegmentedControl}
          />
        ) : null}
        {selectedOption === "email_notification" ? (
          <NotificationRuleEmailNotificationDetails
            emailDesignId={
              selectedNotificationRule?.details?.email_design ?? null
            }
            selectedNotificationEventId={selectedNotificationEventId}
            selectedNotificationRule={selectedNotificationRule}
            fetchNotificationRuleEventData={fetchNotificationRuleEventData}
            toggleEmailCarbonCopy={toggleEmailCarbonCopy}
            toggleEmailNotification={toggleEmailNotification}
          />
        ) : null}
        {!shouldBlockPushNotification &&
        selectedOption === "push_notification" ? (
          <NotificationRulePushNotificationDetails
            selectedNotificationEventId={selectedNotificationEventId}
            selectedNotificationRule={selectedNotificationRule}
            fetchNotificationRuleEventData={fetchNotificationRuleEventData}
          />
        ) : null}
      </div>
    </div>
  );
};
