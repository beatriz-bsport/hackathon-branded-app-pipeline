import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Button, Card, Chip } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { i18nInstance, useTranslation } from "#src/utils/i18n";

import type { CampaignScheduledDetailsProps } from "./CampaignScheduledDetails";

type CampaignScheduledMetadataBannerProps = Omit<
  CampaignScheduledDetailsProps,
  "campaignUuid" | "campaignContent"
> & {
  onPreview: () => void;
};

export const CampaignScheduledMetadataBanner = ({
  campaignKind,
  campaignDate,
  onPreview,
}: CampaignScheduledMetadataBannerProps) => {
  const { t } = useTranslation("campaign");
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
      <div className="flex flex-row gap-md justify-between">
        <div id="campaign-channel" className="flex flex-col gap-xs">
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.channel")}
          </Body>
          <Chip
            type="weak"
            color="default"
            size="lg"
            iconLeft={communicationKindChips[campaignKind].icons}
            label={communicationKindChips[campaignKind].label}
          />
        </div>
        <div id="campaign-status" className="flex flex-col gap-xs">
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.status")}
          </Body>
          <Chip
            type="weak"
            color="default"
            size="lg"
            label={t("campaignStatus.scheduled")}
          />
        </div>
        <div id="campaign-date" className="flex flex-col gap-xs">
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.scheduledDate")}
          </Body>
          <Body weight="stronger" size="lg">
            {formattedDate}
          </Body>
        </div>
        <Button
          id="campaign-preview-button"
          intent="default"
          color="main"
          size="md"
          label={t("campaignDetails.metadataBanner.previewButton")}
          onClick={() => {
            onPreview();
          }}
        />
      </div>
    </Card>
  );
};
