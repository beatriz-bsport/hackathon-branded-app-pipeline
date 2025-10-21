import { Body, Card, Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useFetchCommunicationCampaignSummary } from "#src/hooks/api/use-fetch-communication-campaign-summary";
import { useTranslation } from "#src/utils/i18n";

import { CommunicationStatusHelper } from "./CommunicationStatusHelper";

type MarketingNotificationPerformanceDetailsProps = {
  notification: MarketingNotification;
};

export const MarketingNotificationPerformanceDetails = ({
  notification,
}: MarketingNotificationPerformanceDetailsProps) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const { communicationCampaignSummary } = useFetchCommunicationCampaignSummary(
    {
      communicationObjectId: notification.id,
    },
  );

  const totalMembersReached =
    communicationCampaignSummary?.total_recipients ?? 0;

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h3" weight="strong">
        {t("drawer.performance.emails.title")}
      </Title>
      <div className="flex flex-row gap-md w-full">
        <Card className="w-full">
          <Body htmlVariant="p" weight="strong">
            {totalMembersReached}
          </Body>
          <Body htmlVariant="p" color="weak">
            {t("drawer.performance.emails.totalEmailsSent")}
          </Body>
        </Card>
        <Card className="flex flex-col w-full">
          <div className="flex flex-row gap-xs items-baseline">
            <Body htmlVariant="p" weight="strong">
              {communicationCampaignSummary?.emailOpeningRate.toFixed(1)}%
            </Body>
            <Body htmlVariant="p" size="sm" weight="weaker">
              {/** @ts-expect-error plural management */}
              {t("drawer.performance.emails.recipientsTotal", {
                count: totalMembersReached,
              })}
            </Body>
          </div>
          <Body htmlVariant="p" color="weak">
            {t("drawer.performance.emails.openRate")}
          </Body>
        </Card>
      </div>
      {totalMembersReached === 0 ? (
        <div className="flex flex-col gap-sm">
          <Title htmlVariant="h3">
            {t("drawer.performance.allNotifications.noCommunications.title")}
          </Title>
          <Body htmlVariant="p" color="weak">
            {t(
              "drawer.performance.allNotifications.noCommunications.description",
            )}
          </Body>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <div className="flex flex-row justify-between items-center">
            <Title htmlVariant="h3" weight="strong">
              {t("drawer.performance.allNotifications.title")}
            </Title>
            <CommunicationStatusHelper />
          </div>
        </div>
      )}
    </div>
  );
};
