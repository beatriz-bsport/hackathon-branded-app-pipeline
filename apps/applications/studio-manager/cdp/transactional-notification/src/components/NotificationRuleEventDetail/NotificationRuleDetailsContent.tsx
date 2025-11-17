import { useEffect, useState } from "react";
import type { FC } from "react";
import { useSearchParams } from "react-router";

import { SegmentedControl, Title } from "@bsport/kaizen-primitive-core";

import { NotificationRuleEmailNotificationDetails } from "#src/components/NotificationRuleEventDetail/NotificationRuleEmailNotificationDetails";
import { useFetchNotificationRuleEventGroupDetails } from "#src/hooks/api/use-fetch-notification-rule-event-group-details";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import {
  NOTIFICATION_EVENT_QUERY_PARAM,
  NOTIFICATION_TYPE_EMAIL,
  NOTIFICATION_TYPE_PUSH,
  NOTIFICATION_TYPE_QUERY_PARAM,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type {
  NotificationSegments,
  RefinedNotificationRuleEventData,
  ToggleEmailNotificationMethodParams,
} from "#src/utils/types";
import { isNotificationSegment } from "#src/utils/utils";

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

export const NotificationRuleDetailsContent: FC<
  NotificationRuleDetailsContentProps
> = ({
  selectedNotificationEventId,
  selectedNotificationRule,
  getNotificationRuleEventLabel,
  toggleEmailCarbonCopy,
  toggleEmailNotification,
}: NotificationRuleDetailsContentProps) => {
  const { t } = useTranslation("transactionalNotification");
  const { isPushNotificationEnabled } = useAvailableUpsells();
  const [searchParams, setSearchParams] = useSearchParams();
  const hidePushNotification =
    !isPushNotificationEnabled ||
    selectedNotificationRule?.settings?.disabled_checkboxes ||
    (selectedNotificationRule?.rule.required_tags || []).length > 0;
  const [selectedOption, setSelectedOption] = useState<
    NotificationSegments | undefined
  >(undefined);

  const { fetchNotificationRuleEventData } =
    useFetchNotificationRuleEventGroupDetails();

  const handleChangeSegmentedControl = (value: string) => {
    if (!isNotificationSegment(value)) return;
    setSelectedOption(value);
    setSearchParams((params) => {
      searchParams.set(NOTIFICATION_TYPE_QUERY_PARAM, value);
      return params;
    });
  };

  useEffect(() => {
    const notificationType = searchParams.get(NOTIFICATION_TYPE_QUERY_PARAM);
    const initialSegment: NotificationSegments =
      isPushNotificationEnabled &&
      notificationType &&
      !hidePushNotification &&
      isNotificationSegment(notificationType)
        ? notificationType
        : NOTIFICATION_TYPE_EMAIL;
    setSelectedOption(initialSegment);
    setSearchParams((params) => {
      searchParams.set(NOTIFICATION_TYPE_QUERY_PARAM, initialSegment);
      searchParams.set(
        NOTIFICATION_EVENT_QUERY_PARAM,
        String(selectedNotificationEventId),
      );
      return params;
    });
    return () => {
      setSearchParams((params) => {
        searchParams.delete(NOTIFICATION_TYPE_QUERY_PARAM);
        searchParams.delete(NOTIFICATION_EVENT_QUERY_PARAM);
        return params;
      });
    };
  }, [selectedNotificationEventId]);

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
        {hidePushNotification ? null : (
          <SegmentedControl
            fullWidth
            id="notification-rule-communication-type"
            className="h-xl"
            value={selectedOption}
            options={[
              {
                value: NOTIFICATION_TYPE_EMAIL,
                label: t(
                  "notificationRuleEventDetails.details.segmentedControl.email",
                ),
              },
              {
                value: NOTIFICATION_TYPE_PUSH,
                label: t(
                  "notificationRuleEventDetails.details.segmentedControl.push",
                ),
              },
            ]}
            onChangeValue={handleChangeSegmentedControl}
          />
        )}
        {selectedOption === NOTIFICATION_TYPE_EMAIL ? (
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
        {hidePushNotification ||
        selectedOption !== NOTIFICATION_TYPE_PUSH ? null : (
          <NotificationRulePushNotificationDetails
            selectedNotificationEventId={selectedNotificationEventId}
            selectedNotificationRule={selectedNotificationRule}
            fetchNotificationRuleEventData={fetchNotificationRuleEventData}
          />
        )}
      </div>
    </div>
  );
};
