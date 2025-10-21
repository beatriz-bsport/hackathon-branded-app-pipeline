import { useState } from "react";
import { useSearchParams } from "react-router";

import { SegmentedControl, Title } from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";
import { deletePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { NotificationActionsMenu } from "#src/components/Common/NotificationActionsMenu";
import { NotificationToggle } from "#src/components/Common/NotificationToggle";
import { MarketingNotificationPerformanceDetails } from "#src/components/MarketingNotificationDetails/Performance/MarketingNotificationPerformanceDetails";
import { MarketingNotificationTriggerDetails } from "#src/components/MarketingNotificationDetails/Trigger/MarketingNotificationTriggerDetails";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { usePermissionsChecker } from "#src/hooks/permissions/use-permissions-checker";
import { useTranslation } from "#src/utils/i18n";

const SEGMENTED_CONTROL_QUERY_PARAM = "notificationDetailView";

type NotificationSegments = "performance" | "trigger" | "content";

function isNotificationSegment(value: string): value is NotificationSegments {
  return value === "performance" || value === "trigger" || value === "content";
}

type MarketingNotificationDetailsContentProps = {
  notification: MarketingNotification | null;
};

export const MarketingNotificationDetailsContent: React.FC<
  MarketingNotificationDetailsContentProps
> = ({ notification }: MarketingNotificationDetailsContentProps) => {
  const { t } = useTranslation([
    "marketingNotificationList",
    "marketingNotificationDetails",
  ]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearchParam, setCurrentSearchParam] = useState(
    searchParams.get(SEGMENTED_CONTROL_QUERY_PARAM),
  );
  const [selectedOption, setSelectedOption] = useState<NotificationSegments>(
    currentSearchParam && isNotificationSegment(currentSearchParam)
      ? currentSearchParam
      : "performance",
  );
  const { emailTemplatesById } = useGetMarketingNotificationDependenciesData();

  const { isUserMarketingNotificationManager } = usePermissionsChecker();

  const handleChangeSegmentedControl = (value: string) => {
    if (!isNotificationSegment(value)) return;
    deletePaginationQueryParams(setSearchParams);
    setSelectedOption(value);
    setCurrentSearchParam(value);
  };

  const isEmailTemplateValid =
    !!notification &&
    typeof notification.email_design === "number" &&
    notification.email_design in emailTemplatesById;

  if (!notification) {
    return null;
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-row justify-between">
        <Title htmlVariant="h3" weight="strong">
          {t("drawer.overview", { ns: "marketingNotificationDetails" })}
        </Title>
        <div className="flex flex-row gap-sm">
          <NotificationToggle
            isEmailNotificationBroken={!isEmailTemplateValid}
            isActive={!!notification.active}
            disabled={!isUserMarketingNotificationManager}
            notificationId={notification.id}
          />
          <NotificationActionsMenu
            onEdit={(id) => console.log("edit", id)}
            onDelete={(id) => console.log("delete", id)}
            notificationId={notification.id}
          />
        </div>
      </div>
      <SegmentedControl
        fullWidth
        id="marketing-notification-detail-view-segmented-control"
        className="h-xl"
        urlQueryParamName={SEGMENTED_CONTROL_QUERY_PARAM}
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
      {selectedOption === "performance" ? (
        <MarketingNotificationPerformanceDetails notification={notification} />
      ) : selectedOption === "trigger" ? (
        <MarketingNotificationTriggerDetails notification={notification} />
      ) : (
        <div className="mt-md">Content content</div>
      )}
    </div>
  );
};
