import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  Loader,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreviewCount } from "#src/api/use-fetch-communication-recipients-preview-count";
import {
  COMMUNICATION_CHANNEL_BY_KIND_MAP,
  COMMUNICATION_KIND_ICON_MAP,
} from "#src/utils/constants";
import { i18nInstance, useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";
import type { CampaignScheduledDetailsProps } from "./CampaignScheduledDetails";

type CampaignScheduledMetadataBannerProps = Omit<
  CampaignScheduledDetailsProps,
  "campaignUuid" | "campaignContent"
> & {
  onPreview: () => void;
};

export const CampaignScheduledMetadataBanner = ({
  campaignScheduledId,
  campaignKind,
  campaignDate,
  onPreview,
}: CampaignScheduledMetadataBannerProps) => {
  const { t } = useTranslation("campaign");
  const isMobile = !useMatchMedia("lg");

  const { language } = i18nInstance;

  const communicationKindChips = {
    [CommunicationKind.EMAIL]: {
      label: t("communicationKind.email"),
      icons: COMMUNICATION_KIND_ICON_MAP[CommunicationKind.EMAIL],
    },
    [CommunicationKind.SMS]: {
      label: t("communicationKind.sms"),
      icons: COMMUNICATION_KIND_ICON_MAP[CommunicationKind.SMS],
    },
    [CommunicationKind.PUSH]: {
      label: t("communicationKind.push"),
      icons: COMMUNICATION_KIND_ICON_MAP[CommunicationKind.PUSH],
    },
  };

  const formattedDate = formatDateTime(
    campaignDate,
    DATETIME_FORMATS.MEDIUM_DATETIME,
    {
      locale: language,
    },
  );

  return (
    <Card>
      <div className="grid grid-cols-1 gap-sm md:grid-cols-5 md:gap-md [grid-template-areas:'channel_status'_'date_recipients'_'button_button'] md:[grid-template-areas:'channel_status_date_recipients_button']">
        <div
          id="campaign-channel"
          className="flex flex-col gap-xs [grid-area:channel]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.channel")}
          </Body>
          <Chip
            className="w-fit"
            type="weak"
            color="default"
            size="lg"
            iconLeft={communicationKindChips[campaignKind].icons}
            label={communicationKindChips[campaignKind].label}
          />
        </div>
        <div
          id="campaign-status"
          className="flex flex-col gap-xs [grid-area:status]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.status")}
          </Body>
          <Chip
            className="w-fit"
            type="weak"
            color="default"
            size="lg"
            label={t("campaignStatus.scheduled")}
          />
        </div>
        <div
          id="campaign-date"
          className="flex flex-col gap-xs [grid-area:date]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.scheduledDate")}
          </Body>
          <Body weight="stronger" size="lg">
            {formattedDate}
          </Body>
        </div>
        <div
          id="campaign-recipients-count-preview"
          className="flex flex-col gap-xs [grid-area:recipients]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.recipients")}
          </Body>
          <QueryBoundary loadingFallback={<Loader size="md" />}>
            <CampaignScheduledMetadataRecipientsCountPreview
              campaignKind={campaignKind}
              campaignScheduledId={campaignScheduledId}
            />
          </QueryBoundary>
        </div>
        <div className="[grid-area:button] self-center">
          <Button
            fullWidth={isMobile}
            id="campaign-preview-button"
            intent="default"
            color="main"
            size="md"
            label={t("campaignDetails.metadataBanner.previewButton")}
            onClick={() => onPreview()}
          />
        </div>
      </div>
    </Card>
  );
};

export const CampaignScheduledMetadataRecipientsCountPreview = ({
  campaignKind,
  campaignScheduledId,
}: {
  campaignKind: CommunicationKind;
  campaignScheduledId: number;
}) => {
  const { data: recipientsCountPreview } =
    useFetchCommunicationRecipientsPreviewCount({
      channel: COMMUNICATION_CHANNEL_BY_KIND_MAP[campaignKind],
      is_marketing: true,
      target: {
        type: "communication_scheduled",
        communication_scheduled_id: campaignScheduledId,
      },
    });
  return (
    <Body weight="stronger" size="lg">
      {recipientsCountPreview?.count ?? 0}
    </Body>
  );
};
