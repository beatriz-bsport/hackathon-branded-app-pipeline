import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CommunicationKind, EventKind } from "#src/api/constants";
import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
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
  const { t, i18n } = useTranslation();

  const isMobile = !useMatchMedia("md");
  const { isPreviewOpen, onPreviewOpen, onPreviewClose } = usePreviewDrawer();

  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const triggerLabel =
    automation.event_kind === EventKind.JOIN
      ? t(
          automation.communication_kind === CommunicationKind.SMS
            ? "automation.sms.form.condition.options.entry"
            : "automation.push.form.condition.options.entry",
          { ns: "details" },
        )
      : t(
          automation.communication_kind === CommunicationKind.SMS
            ? "automation.sms.form.condition.options.exit"
            : "automation.push.form.condition.options.exit",
          { ns: "details" },
        );

  const channelLabel =
    automation.communication_kind === CommunicationKind.SMS
      ? t("actions.createAutomationModal.messageChannel.sms.title", {
          ns: "details",
        })
      : t("actions.createAutomationModal.messageChannel.push.title", {
          ns: "details",
        });

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
        <div className="grid gap-sm [grid-template-columns:1fr_1fr] [grid-template-areas:'channel_trigger'_'created_created'_'button_button'] md:grid-cols-5 md:gap-md md:[grid-template-areas:'channel_trigger_created_created_button']">
          <div className="flex flex-col gap-xs [grid-area:channel]">
            <Body size="sm" color="weak">
              {t("campaignDetails.metadataBanner.headers.channel", {
                ns: "campaign",
              })}
            </Body>
            <Chip
              className="w-fit"
              type="weak"
              color="default"
              size="lg"
              iconLeft={
                COMMUNICATION_KIND_ICON_MAP[automation.communication_kind]
              }
              label={channelLabel}
            />
          </div>
          <div className="flex flex-col gap-xs [grid-area:trigger]">
            <Body size="sm" color="weak">
              {t("automation.messagePage.metadata.headers.trigger", {
                ns: "details",
              })}
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
              {t("automation.messages.columns.createdOn", { ns: "details" })}
            </Body>
            <Body weight="stronger" size="lg">
              {createdOn}
            </Body>
          </div>
          <div className="[grid-area:button] self-center">
            <Button
              id="automation-message-preview-button"
              intent="default"
              color="main"
              size="md"
              fullWidth={isMobile}
              label={t("campaignDetails.metadataBanner.previewButton", {
                ns: "campaign",
              })}
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
