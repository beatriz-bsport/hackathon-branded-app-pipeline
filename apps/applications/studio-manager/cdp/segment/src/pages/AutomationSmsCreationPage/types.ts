import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationEventValue,
  type PushAutomationTriggerLimitValue,
} from "../AutomationPushCreationPage/types";

export const SMS_AUTOMATION_MAX_MESSAGE_LENGTH = 160;

export {
  PUSH_AUTOMATION_EVENT_VALUES as SMS_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES as SMS_AUTOMATION_TRIGGER_LIMIT_VALUES,
};

export type SmsAutomationEventValue = PushAutomationEventValue;
export type SmsAutomationTriggerLimitValue = PushAutomationTriggerLimitValue;

export type SmsAutomationFormData = {
  eventKind: SmsAutomationEventValue;
  triggerLimit: SmsAutomationTriggerLimitValue;
  message: string;
};
