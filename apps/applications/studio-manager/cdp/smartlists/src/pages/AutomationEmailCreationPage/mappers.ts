import {
  mapFormEventKindToApiEventKind,
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
