import {
  type AutomatedCampaign,
  type CreateAutomatedCampaignParams,
  EventKind,
} from "@bsport/api-cdp";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationEventValue,
  type PushAutomationFormData,
  type PushAutomationTriggerLimitValue,
} from "./types";

const TRIGGER_LIMIT_TO_MAX_COMMUNICATIONS_SENT_PER_MEMBER = {
  [PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT]: null,
  [PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE]: 1,
  [PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE]: 2,
  [PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES]: 3,
} satisfies Record<PushAutomationTriggerLimitValue, number | null>;

const MAX_COMMUNICATIONS_SENT_PER_MEMBER_TO_TRIGGER_LIMIT: Record<
  number,
  PushAutomationTriggerLimitValue
> = {
  1: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
  2: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
  3: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
};

const FORM_EVENT_KIND_TO_API_EVENT_KIND = {
  [PUSH_AUTOMATION_EVENT_VALUES.ENTRY]: EventKind.JOIN,
  [PUSH_AUTOMATION_EVENT_VALUES.EXIT]: EventKind.LEAVE,
} satisfies Record<PushAutomationEventValue, EventKind>;

const API_EVENT_KIND_TO_FORM_EVENT_KIND = {
  [EventKind.JOIN]: PUSH_AUTOMATION_EVENT_VALUES.ENTRY,
  [EventKind.LEAVE]: PUSH_AUTOMATION_EVENT_VALUES.EXIT,
} satisfies Record<EventKind, PushAutomationEventValue>;

export const mapTriggerLimitToMaxCommunicationsSentPerMember = (
  triggerLimit: PushAutomationFormData["triggerLimit"],
): number | null => {
  return TRIGGER_LIMIT_TO_MAX_COMMUNICATIONS_SENT_PER_MEMBER[triggerLimit];
};

export const mapMaxCommunicationsSentPerMemberToTriggerLimit = (
  value: number | null,
): PushAutomationTriggerLimitValue => {
  if (value === null) {
    return PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT;
  }

  return (
    MAX_COMMUNICATIONS_SENT_PER_MEMBER_TO_TRIGGER_LIMIT[value] ??
    PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT
  );
};

export const mapFormEventKindToApiEventKind = (
  eventKind: PushAutomationEventValue,
): EventKind => {
  return FORM_EVENT_KIND_TO_API_EVENT_KIND[eventKind];
};

export const mapApiEventKindToFormEventKind = (
  eventKind: EventKind,
): PushAutomationEventValue => {
  return API_EVENT_KIND_TO_FORM_EVENT_KIND[eventKind];
};

type PushAutomationPayload = Pick<
  CreateAutomatedCampaignParams,
  "event_kind" | "title" | "text" | "max_communications_sent_per_member"
>;

export const pushAutomationFormDataToPayload = (
  formData: PushAutomationFormData,
): PushAutomationPayload => {
  return {
    event_kind: mapFormEventKindToApiEventKind(formData.eventKind),
    title: formData.title,
    text: formData.message,
    max_communications_sent_per_member:
      mapTriggerLimitToMaxCommunicationsSentPerMember(formData.triggerLimit),
  };
};

export const automatedCampaignToFormData = (
  campaign: AutomatedCampaign,
): PushAutomationFormData => {
  return {
    eventKind: mapApiEventKindToFormEventKind(campaign.event_kind),
    triggerLimit: mapMaxCommunicationsSentPerMemberToTriggerLimit(
      campaign.max_communications_sent_per_member,
    ),
    title: campaign.title ?? "",
    message: campaign.text ?? "",
  };
};
