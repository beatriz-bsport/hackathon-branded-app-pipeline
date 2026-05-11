import {
  CommunicationKind,
  EventKind,
} from "@bsport/api-cdp/automated-campaign";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
import { useEmailTemplateSearch } from "#src/api/use-email-template-search";
import { AutomationTriggerIcon } from "#src/components/AutomationTriggerIcon/AutomationTriggerIcon";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { PreviewDrawer } from "./PreviewDrawer";
import { usePreviewDrawer } from "./use-preview-drawer";

const TRIGGER_LABEL_KEYS = {
  [CommunicationKind.EMAIL]: {
    [EventKind.JOIN]: "automation.email.form.condition.options.entry",
    [EventKind.LEAVE]: "automation.email.form.condition.options.exit",
  },
  [CommunicationKind.SMS]: {
    [EventKind.JOIN]: "automation.sms.form.condition.options.entry",
    [EventKind.LEAVE]: "automation.sms.form.condition.options.exit",
  },
  [CommunicationKind.PUSH]: {
    [EventKind.JOIN]: "automation.push.form.condition.options.entry",
    [EventKind.LEAVE]: "automation.push.form.condition.options.exit",
  },
} as const satisfies Record<CommunicationKind, Record<EventKind, string>>;

const CHANNEL_LABEL_KEYS = {
  [CommunicationKind.EMAIL]:
    "actions.createAutomationModal.messageChannel.email.title",
  [CommunicationKind.SMS]:
    "actions.createAutomationModal.messageChannel.sms.title",
  [CommunicationKind.PUSH]:
    "actions.createAutomationModal.messageChannel.push.title",
} as const satisfies Record<CommunicationKind, string>;

type AutomationDetailsCardProps = {
  messageId: string;
};

export function AutomationDetailsCard({
  messageId,
}: AutomationDetailsCardProps) {
  const { t, i18n } = useTranslation();

  const isMobile = !useMatchMedia("md");
  const { isPreviewOpen, onPreviewOpen, onPreviewClose } = usePreviewDrawer();

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);

  const emailTemplateId = automation.email_design;
  const { data: emailTemplateList } = useEmailTemplateSearch({
    searchInput: "",
    id__in: emailTemplateId?.toString() ?? "",
  });
  const emailTemplate = emailTemplateList.find(
    (template) => template.id === emailTemplateId,
  );

  const triggerLabel = t(
    TRIGGER_LABEL_KEYS[automation.communication_kind][automation.event_kind],
    { ns: "details" },
  );

  const channelLabel = t(CHANNEL_LABEL_KEYS[automation.communication_kind], {
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
        communicationKind={automation.communication_kind}
        emailTemplateHtml={emailTemplate?.html ?? null}
        emailTemplateId={emailTemplateId}
        sender={companyTheme?.company_name}
        title={emailTemplate?.subject ?? automation.title}
        content={automation.text}
      />
    </>
  );
}
