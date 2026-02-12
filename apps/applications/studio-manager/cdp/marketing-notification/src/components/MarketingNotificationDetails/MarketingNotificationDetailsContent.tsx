import { useState } from "react";
import { useSearchParams } from "react-router";

import {
  Alert,
  Button,
  SegmentedControl,
  Title,
} from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { NotificationActionsMenu } from "#src/components/Common/NotificationActionsMenu";
import { NotificationToggle } from "#src/components/Common/NotificationToggle";
import { MarketingNotificationPerformanceDetails } from "#src/components/MarketingNotificationDetails/Performance/MarketingNotificationPerformanceDetails";
import { MarketingNotificationTriggerDetails } from "#src/components/MarketingNotificationDetails/Trigger/MarketingNotificationTriggerDetails";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useFormatNotificationTriggerName } from "#src/hooks/layout/use-format-notification-trigger-name";
import { usePermissionsChecker } from "#src/hooks/permissions/use-permissions-checker";
import type { NotificationModalActions } from "#src/pages/MarketingNotificationListPage";
import { useTranslation } from "#src/utils/i18n";
import { checkIfEmailTemplateIsMissing } from "#src/utils/marketingNotification";

import { MarketingNotificationContentDetails } from "./Content/MarketingNotificationContentDetails";

const SEGMENTED_CONTROL_QUERY_PARAM = "notificationDetailView";

type NotificationSegments = "performance" | "trigger" | "content";

function isNotificationSegment(value: string): value is NotificationSegments {
  return value === "performance" || value === "trigger" || value === "content";
}

type MarketingNotificationDetailsContentProps = {
  notification: MarketingNotification | null;
  handleSelectMarketingNotificationAction: ({
    action,
    marketingNotificationId,
  }: {
    action: NotificationModalActions;
    marketingNotificationId: number;
  }) => void;
};

export const MarketingNotificationDetailsContent: React.FC<
  MarketingNotificationDetailsContentProps
> = ({
  notification,
  handleSelectMarketingNotificationAction,
}: MarketingNotificationDetailsContentProps) => {
  const { t } = useTranslation([
    "marketingNotificationList",
    "marketingNotificationDetails",
  ]);
  const [searchParams] = useSearchParams();
  const [currentSearchParam, setCurrentSearchParam] = useState(
    searchParams.get(SEGMENTED_CONTROL_QUERY_PARAM),
  );
  const [selectedOption, setSelectedOption] = useState<NotificationSegments>(
    currentSearchParam && isNotificationSegment(currentSearchParam)
      ? currentSearchParam
      : "performance",
  );
  const { checkNotificationEntityExistence } =
    useFormatNotificationTriggerName();
  const { emailTemplatesById } = useGetMarketingNotificationDependenciesData();

  const { isUserMarketingNotificationManager } = usePermissionsChecker();

  const handleChangeSegmentedControl = (value: string) => {
    if (!isNotificationSegment(value)) return;
    setSelectedOption(value);
    setCurrentSearchParam(value);
  };

  if (!notification) {
    return null;
  }

  const isNotificationEntityExisting = notification
    ? checkNotificationEntityExistence({
        marketingNotification: notification,
      })
    : false;
  const isEmailTemplateMissing = checkIfEmailTemplateIsMissing({
    marketingNotification: notification,
    emailTemplatesById: emailTemplatesById,
  });
  const isPushNotificationSet =
    Boolean(notification?.push_notification_title?.trim()) &&
    Boolean(notification?.push_notification_content?.trim());

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-row justify-between">
        <Title htmlVariant="h3" weight="strong">
          {t("drawer.overview", { ns: "marketingNotificationDetails" })}
        </Title>
        {isNotificationEntityExisting ? (
          <>
            {isUserMarketingNotificationManager ? (
              <div className="flex flex-row gap-sm">
                {" "}
                <NotificationToggle
                  isActive={notification.active}
                  isEmailTemplateMissing={isEmailTemplateMissing}
                  isPushNotificationSet={isPushNotificationSet}
                  isUserMarketingNotificationManager={
                    isUserMarketingNotificationManager
                  }
                  notificationId={notification.id}
                />
                <NotificationActionsMenu
                  onEdit={() =>
                    handleSelectMarketingNotificationAction({
                      marketingNotificationId: notification.id,
                      action: "edit",
                    })
                  }
                  onDelete={() =>
                    handleSelectMarketingNotificationAction({
                      marketingNotificationId: notification.id,
                      action: "delete",
                    })
                  }
                  notificationId={notification.id}
                />
              </div>
            ) : null}
          </>
        ) : (
          <Button
            id={`${notification.id}-detail-drawer-delete-notification`}
            color="critical"
            intent="call-to-action"
            size="md"
            iconLeft="trash-01"
            label={t("table.actions.delete")}
            disabled={!isUserMarketingNotificationManager}
            onClick={() => {
              handleSelectMarketingNotificationAction({
                marketingNotificationId: notification.id,
                action: "delete",
              });
            }}
          />
        )}
      </div>
      <SegmentedControl
        fullWidth
        id="marketing-notification-detail-view-segmented-control"
        className="h-xl"
        value={selectedOption}
        options={[
          {
            value: "performance",
            label: t("drawer.segmentedControl.performance", {
              ns: "marketingNotificationDetails",
            }),
          },
          {
            value: "trigger",
            label: t("drawer.segmentedControl.trigger", {
              ns: "marketingNotificationDetails",
            }),
          },
          {
            value: "content",
            label: t("drawer.segmentedControl.content", {
              ns: "marketingNotificationDetails",
            }),
          },
        ]}
        onChangeValue={handleChangeSegmentedControl}
      />
      {isEmailTemplateMissing ? (
        <Alert type="weak" status="critical">
          {t("table.brokenNotification.missingEmail.description")}
        </Alert>
      ) : null}
      {!isNotificationEntityExisting ? (
        <Alert type="weak" status="critical">
          {t("table.brokenNotification.missingEntity.description")}
        </Alert>
      ) : null}
      {selectedOption === "performance" ? (
        <MarketingNotificationPerformanceDetails notification={notification} />
      ) : selectedOption === "trigger" ? (
        <MarketingNotificationTriggerDetails notification={notification} />
      ) : (
        <MarketingNotificationContentDetails notification={notification} />
      )}
    </div>
  );
};
