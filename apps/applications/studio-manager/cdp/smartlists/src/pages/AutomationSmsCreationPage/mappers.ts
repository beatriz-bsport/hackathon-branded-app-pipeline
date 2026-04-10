import type {
  AutomatedCampaign,
  CreateAutomatedCampaignParams,
} from "@bsport/api-cdp";

import {
  mapApiEventKindToFormEventKind,
  mapFormEventKindToApiEventKind,
  mapMaxCommunicationsSentPerMemberToTriggerLimit,
  mapTriggerLimitToMaxCommunicationsSentPerMember,
} from "../AutomationPushCreationPage/mappers";
import { type SmsAutomationFormData } from "./types";

type SmsAutomationPayload = Pick<
  CreateAutomatedCampaignParams,
  "event_kind" | "title" | "text" | "max_communications_sent_per_member"
>;

export const smsAutomationFormDataToPayload = (
  formData: SmsAutomationFormData,
): SmsAutomationPayload => {
  return {
    event_kind: mapFormEventKindToApiEventKind(formData.eventKind),
    title: formData.automationName,
    text: formData.message,
    max_communications_sent_per_member:
      mapTriggerLimitToMaxCommunicationsSentPerMember(formData.triggerLimit),
  };
};

export const automatedCampaignToFormData = (
  campaign: AutomatedCampaign,
): SmsAutomationFormData => {
  return {
    eventKind: mapApiEventKindToFormEventKind(campaign.event_kind),
    triggerLimit: mapMaxCommunicationsSentPerMemberToTriggerLimit(
      campaign.max_communications_sent_per_member,
    ),
    automationName: campaign.title ?? "",
    message: campaign.text ?? "",
  };
};
