import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  type ChipProps,
  useMatchMedia,
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
  const isMobile = !useMatchMedia("md");

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

  return (
    <Card>
      <div
        className={
          "grid grid-cols-1 gap-sm md:grid-cols-5 md:gap-md [grid-template-areas:'channel_status'_'date_recipients'_'button_button'] md:[grid-template-areas:'channel_status_date_recipients_button']"
        }
      >
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
        <div
          id="campaign-date"
          className="flex flex-col gap-xs [grid-area:date]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.sentDate")}
          </Body>
          <Body weight="stronger" size="lg">
            {formattedDate}
          </Body>
        </div>
        <div
          id="campaign-recipients-count"
          className="flex flex-col gap-xs [grid-area:recipients]"
        >
          <Body size="sm" color="weak">
            {t("campaignDetails.metadataBanner.headers.recipients")}
          </Body>
          <Body weight="stronger" size="lg">
            {String(
              campaignTotalRecipients ??
                t("campaignDetails.metadataBanner.noRecipients"),
            )}
          </Body>
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
