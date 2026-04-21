import type { AutomatedCampaign } from "@bsport/api-cdp";

import { hasHtmlTags } from "#src/utils/has-html-tags";

import {
  mapApiEventKindToFormEventKind,
  mapFormEventKindToApiEventKind,
  mapMaxCommunicationsSentPerMemberToTriggerLimit,
  mapTriggerLimitToMaxCommunicationsSentPerMember,
} from "../AutomationPushCreationPage/mappers";
import type { AutomationEmailFormData } from "./types";

type EmailAutomationPayload = {
  event_kind: ReturnType<typeof mapFormEventKindToApiEventKind>;
  title: string;
  text: string;
  email_design: number | null;
  max_communications_sent_per_member: number | null;
};

export const automationEmailFormDataToPayload = (
  formData: AutomationEmailFormData,
): EmailAutomationPayload => {
  return {
    event_kind: mapFormEventKindToApiEventKind(formData.eventKind),
    title: formData.emailSubject?.trim() ?? "",
    text: formData.isTextOnly
      ? (formData.emailBody ?? "")
      : (formData.emailTemplateHtml ?? ""),
    email_design: formData.emailTemplateId ?? null,
    max_communications_sent_per_member:
      mapTriggerLimitToMaxCommunicationsSentPerMember(formData.triggerLimit),
  };
};

export const automatedCampaignToFormData = (
  campaign: AutomatedCampaign,
): AutomationEmailFormData => {
  const hasTemplateId = campaign.email_design != null;
  const body = campaign.text ?? "";
  const isOnTheFlyHtmlTemplate = !hasTemplateId && hasHtmlTags(body);

  if (!hasTemplateId) {
    if (isOnTheFlyHtmlTemplate) {
      return {
        emailType: "marketing",
        eventKind: mapApiEventKindToFormEventKind(campaign.event_kind),
        triggerLimit: mapMaxCommunicationsSentPerMemberToTriggerLimit(
          campaign.max_communications_sent_per_member,
        ),
        isTextOnly: false,
        emailSubject: campaign.title ?? "",
        emailBody: undefined,
        emailTemplateId: null,
        emailTemplateDesign: undefined,
        emailTemplateHtml: body,
        isOnTheFlyHtmlTemplate,
      };
    }

    return {
      emailType: "marketing",
      eventKind: mapApiEventKindToFormEventKind(campaign.event_kind),
      triggerLimit: mapMaxCommunicationsSentPerMemberToTriggerLimit(
        campaign.max_communications_sent_per_member,
      ),
      isTextOnly: true,
      emailSubject: campaign.title ?? "",
      emailBody: body,
      emailTemplateId: null,
      emailTemplateDesign: undefined,
      emailTemplateHtml: undefined,
      isOnTheFlyHtmlTemplate,
    };
  }

  return {
    emailType: "marketing",
    eventKind: mapApiEventKindToFormEventKind(campaign.event_kind),
    triggerLimit: mapMaxCommunicationsSentPerMemberToTriggerLimit(
      campaign.max_communications_sent_per_member,
    ),
    isTextOnly: false,
    emailSubject: campaign.title ?? "",
    emailBody: "",
    emailTemplateId: campaign.email_design,
    emailTemplateDesign: undefined,
    emailTemplateHtml: body,
    isOnTheFlyHtmlTemplate: false,
  };
};
