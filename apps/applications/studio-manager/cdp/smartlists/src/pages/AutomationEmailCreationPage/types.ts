import type {
  EmailChannelFormData,
  EmailMessageContentFormData,
} from "#src/components/EmailCampaignForm/types";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationEventValue,
  type PushAutomationTriggerLimitValue,
} from "../AutomationPushCreationPage/types";

export const EMAIL_AUTOMATION_EVENT_VALUES = PUSH_AUTOMATION_EVENT_VALUES;
export const EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES =
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES;

export type EmailAutomationEventValue = PushAutomationEventValue;
export type EmailAutomationTriggerLimitValue = PushAutomationTriggerLimitValue;

export type AutomationEmailFormData = EmailChannelFormData &
  EmailMessageContentFormData & {
    eventKind: EmailAutomationEventValue;
    triggerLimit: EmailAutomationTriggerLimitValue;
  };
