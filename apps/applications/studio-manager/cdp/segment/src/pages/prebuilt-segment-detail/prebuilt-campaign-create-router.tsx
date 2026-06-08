import { Link, Navigate, useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@bsport/kaizen-primitive-core";

import { useUpsellChecker } from "#src/hooks/use-upsell-checker";
import { CreateEmailCampaignContent } from "#src/pages/EmailCampaign/create-email-campaign";
import {
  formatSchedulePrebuiltSegmentEmailCampaignPayload,
  formatSendPrebuiltSegmentEmailCampaignPayload,
} from "#src/pages/EmailCampaign/utils/format-email-campaign-payload";
import { CreatePushCampaignContent } from "#src/pages/push-campaign/create-push-campaign";
import {
  formatSchedulePrebuiltSegmentPushCampaignPayload,
  formatSendPrebuiltSegmentPushCampaignPayload,
} from "#src/pages/push-campaign/utils/format-push-campaign-payload";
import { CreateSmsCampaignContent } from "#src/pages/sms-campaign/create-sms-campaign";
import {
  formatSchedulePrebuiltSegmentSmsCampaignPayload,
  formatSendPrebuiltSegmentSmsCampaignPayload,
} from "#src/pages/sms-campaign/utils/format-sms-campaign-payload";
import {
  CAMPAIGN_CHANNEL_EMAIL,
  CAMPAIGN_CHANNEL_PUSH,
  CAMPAIGN_CHANNEL_SMS,
  SMARTLIST_APP_LINKS,
} from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { isPrebuiltSegmentId } from "#src/utils/prebuilt-segment";

export const PrebuiltCampaignCreateRouter = () => {
  const { t } = useTranslation(["list", "campaign"]);
  const navigate = useNavigate();
  const { hasSmsUpsell, hasPushNotificationUpsell } = useUpsellChecker();
  const { prebuiltSegmentId, channel } = useParams<{
    prebuiltSegmentId: string;
    channel: string;
  }>();

  if (!prebuiltSegmentId || !isPrebuiltSegmentId(prebuiltSegmentId)) {
    return <Navigate to={SMARTLIST_APP_LINKS.prebuiltIndex()} replace />;
  }

  const campaignsPath =
    SMARTLIST_APP_LINKS.prebuiltDetailsCampaigns(prebuiltSegmentId);
  const segmentTitle = t(`prebuilt.segments.${prebuiltSegmentId}.title`, {
    ns: "list",
  });

  const breadcrumbsItems = [
    <Link
      key="prebuilt-segments-breadcrumb"
      to={SMARTLIST_APP_LINKS.prebuiltIndex()}
    >
      <Breadcrumbs.Item
        id="breadcrumb-prebuilt-segments"
        text={t("tabs.prebuilt", { ns: "list" })}
      />
    </Link>,
    <Link key="prebuilt-segment-campaigns-breadcrumb" to={campaignsPath}>
      <Breadcrumbs.Item
        id="breadcrumb-prebuilt-segment-campaigns"
        text={segmentTitle}
      />
    </Link>,
  ];

  const onSuccess = () => {
    navigate(campaignsPath);
  };

  switch (channel) {
    case CAMPAIGN_CHANNEL_EMAIL:
      return (
        <CreateEmailCampaignContent
          breadcrumbsItems={breadcrumbsItems}
          recipientTarget={{
            type: "segment",
            segment_identifier: prebuiltSegmentId,
          }}
          onSuccess={onSuccess}
          formatSendPayload={(data) =>
            formatSendPrebuiltSegmentEmailCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
            })
          }
          formatSchedulePayload={({ data, datetimeScheduled }) =>
            formatSchedulePrebuiltSegmentEmailCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
              datetimeScheduled,
            })
          }
        />
      );
    case CAMPAIGN_CHANNEL_SMS:
      if (!hasSmsUpsell) {
        return <Navigate to={campaignsPath} replace />;
      }
      return (
        <CreateSmsCampaignContent
          breadcrumbsItems={breadcrumbsItems}
          recipientTarget={{
            type: "segment",
            segment_identifier: prebuiltSegmentId,
          }}
          onSuccess={onSuccess}
          formatSendPayload={(data) =>
            formatSendPrebuiltSegmentSmsCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
            })
          }
          formatSchedulePayload={({ data, datetimeScheduled }) =>
            formatSchedulePrebuiltSegmentSmsCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
              datetimeScheduled,
            })
          }
        />
      );
    case CAMPAIGN_CHANNEL_PUSH:
      if (!hasPushNotificationUpsell) {
        return <Navigate to={campaignsPath} replace />;
      }
      return (
        <CreatePushCampaignContent
          breadcrumbsItems={breadcrumbsItems}
          onSuccess={onSuccess}
          formatSendPayload={(data) =>
            formatSendPrebuiltSegmentPushCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
            })
          }
          formatSchedulePayload={({ data, datetimeScheduled }) =>
            formatSchedulePrebuiltSegmentPushCampaignPayload({
              segmentIdentifier: prebuiltSegmentId,
              data,
              datetimeScheduled,
            })
          }
        />
      );
    default:
      return <Navigate to={campaignsPath} replace />;
  }
};

export default PrebuiltCampaignCreateRouter;
