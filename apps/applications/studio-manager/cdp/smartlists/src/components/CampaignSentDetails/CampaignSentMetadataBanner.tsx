import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  type ChipProps,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { i18nInstance, useTranslation } from "#src/utils/i18n";
import {
  STREAMLINED_COMMUNICATION_STATUS_DELIVERED,
  STREAMLINED_COMMUNICATION_STATUS_FAILED,
  STREAMLINED_COMMUNICATION_STATUS_OPENED,
  STREAMLINED_COMMUNICATION_STATUS_PROCESSING,
  StreamlinedCommunicationStatus,
} from "#src/utils/types";

type CampaignSentMetadataBannerProps = {
  campaignKind: CommunicationKind;
  campaignStatus?: StreamlinedCommunicationStatus;
  campaignDate: string;
  campaignTotalRecipients?: number;
  onPreview: () => void;
};

export const CampaignSentMetadataBanner = ({
  campaignKind,
  campaignStatus,
  campaignDate,
  campaignTotalRecipients,
  onPreview,
}: CampaignSentMetadataBannerProps) => {
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

  const communicationStatusChips = {
    [STREAMLINED_COMMUNICATION_STATUS_DELIVERED]: {
      label: t("campaignStatus.delivered"),
      color: "positive",
    },
    [STREAMLINED_COMMUNICATION_STATUS_PROCESSING]: {
      label: t("campaignStatus.processing"),
      color: "info",
    },
    [STREAMLINED_COMMUNICATION_STATUS_FAILED]: {
      label: t("campaignStatus.failed"),
      color: "critical",
    },
    [STREAMLINED_COMMUNICATION_STATUS_OPENED]: {
      label: t("campaignStatus.opened"),
      color: "main",
    },
  };

  const formattedDate = formatDateTime(
    campaignDate,
    DATETIME_FORMATS.MEDIUM_DATETIME,
    {
      locale: language,
    },
  );

  const shouldDisplayRecipientsCount =
    campaignTotalRecipients != null && campaignKind !== CommunicationKind.PUSH;

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
            color={
              campaignStatus !== undefined
                ? (communicationStatusChips[campaignStatus]
                    .color as ChipProps["color"])
                : "default"
            }
            size="lg"
            label={
              campaignStatus !== undefined
                ? communicationStatusChips[campaignStatus].label
                : t("campaignStatus.na")
            }
          />
        </div>
        <div id="campaign-date" className="flex flex-col gap-xs">
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.sentDate")}
          </Body>
          <Body weight="stronger" size="lg">
            {formattedDate}
          </Body>
        </div>
        {shouldDisplayRecipientsCount ? (
          <div id="campaign-recipients-count" className="flex flex-col gap-xs">
            <Body size="sm" color="weak">
              {t("campaignDetails.metadataBanner.headers.recipients")}
            </Body>
            <Body weight="stronger" size="lg">
              {String(campaignTotalRecipients)}
            </Body>
          </div>
        ) : null}
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
