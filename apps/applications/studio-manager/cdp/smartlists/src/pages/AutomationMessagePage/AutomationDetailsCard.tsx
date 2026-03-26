import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { EventKind } from "#src/api/constants";
import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
import { useAutomatedCampaignSummarySuspenseQuery } from "#src/api/use-automated-campaign-summary";
import { AutomationTriggerIcon } from "#src/components/AutomationTriggerIcon/AutomationTriggerIcon";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { PreviewDrawer, usePreviewDrawer } from "./PreviewDrawer";

type AutomationDetailsCardProps = {
  messageId: string;
};

export function AutomationDetailsCard({
  messageId,
}: AutomationDetailsCardProps) {
  const { t: tDetails, i18n } = useTranslation("details");
  const { t: tCampaign } = useTranslation("campaign");

  const isMobile = !useMatchMedia("md");
  const { isPreviewOpen, onPreviewOpen, onPreviewClose } = usePreviewDrawer();

  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);
  const { data: campaignSummary } =
    useAutomatedCampaignSummarySuspenseQuery(+messageId);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const triggerLabel =
    automation.event_kind === EventKind.JOIN
      ? tDetails("automation.push.form.condition.options.entry")
      : tDetails("automation.push.form.condition.options.exit");

  const totalRecipients = campaignSummary.total_recipients;

  const createdOn = formatDateTime(
    automation.date_created,
    DATETIME_FORMATS.MEDIUM_DATETIME,
    {
      locale: i18n.language,
    },
  );

  return (
    <>
      <Card>
        <div className="grid gap-sm [grid-template-columns:1fr_1fr] [grid-template-areas:'channel_trigger'_'created_recipients'_'button_button'] md:grid-cols-5 md:gap-md md:[grid-template-areas:'channel_trigger_created_recipients_button']">
          <div className="flex flex-col gap-xs [grid-area:channel]">
            <Body size="sm" color="weak">
              {tCampaign("campaignDetails.metadataBanner.headers.channel")}
            </Body>
            <Chip
              className="w-fit"
              type="weak"
              color="default"
              size="lg"
              iconLeft={
                COMMUNICATION_KIND_ICON_MAP[automation.communication_kind]
              }
              label={tDetails(
                "actions.createAutomationModal.messageChannel.push.title",
              )}
            />
          </div>
          <div className="flex flex-col gap-xs [grid-area:trigger]">
            <Body size="sm" color="weak">
              {tDetails("automation.messagePage.metadata.headers.trigger")}
            </Body>
            <div className="flex items-center gap-xs">
              <AutomationTriggerIcon
                trigger={automation.event_kind}
                size="sm"
              />
              <Body size="md" weight="stronger">
                {triggerLabel}
              </Body>
            </div>
          </div>
          <div className="flex flex-col gap-xs [grid-area:created]">
            <Body size="sm" color="weak">
              {tDetails("automation.messages.columns.createdOn")}
            </Body>
            <Body weight="stronger" size="lg">
              {createdOn}
            </Body>
          </div>
          <div className="flex flex-col gap-xs [grid-area:recipients]">
            <Body size="sm" color="weak">
              {tCampaign("campaignDetails.metadataBanner.headers.recipients")}
            </Body>
            <Body weight="stronger" size="lg">
              {String(totalRecipients)}
            </Body>
          </div>
          <div className="[grid-area:button] self-center">
            <Button
              id="automation-message-preview-button"
              intent="default"
              color="main"
              size="md"
              fullWidth={isMobile}
              label={tCampaign("campaignDetails.metadataBanner.previewButton")}
              onClick={onPreviewOpen}
            />
          </div>
        </div>
      </Card>

      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        sender={companyTheme?.company_name}
        title={automation.title}
        content={automation.text}
      />
    </>
  );
}
