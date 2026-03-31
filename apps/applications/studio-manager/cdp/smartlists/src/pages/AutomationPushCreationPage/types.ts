import { EventKind } from "#src/api/constants";

export const PUSH_AUTOMATION_MAX_TITLE_LENGTH = 25;
export const PUSH_AUTOMATION_MAX_MESSAGE_LENGTH = 200;

export const PUSH_AUTOMATION_EVENT_VALUES = {
  ENTRY: String(EventKind.JOIN),
  EXIT: String(EventKind.LEAVE),
} as const;

export const PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES = {
  NO_LIMIT: "no-limit",
  ONCE: "1",
  TWICE: "2",
  THREE_TIMES: "3",
} as const;

export type PushAutomationEventValue =
  (typeof PUSH_AUTOMATION_EVENT_VALUES)[keyof typeof PUSH_AUTOMATION_EVENT_VALUES];

export type PushAutomationTriggerLimitValue =
  (typeof PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES)[keyof typeof PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES];

export const isPushAutomationEventValue = (
  value: string,
): value is PushAutomationEventValue => {
  return (
    value === PUSH_AUTOMATION_EVENT_VALUES.ENTRY ||
    value === PUSH_AUTOMATION_EVENT_VALUES.EXIT
  );
};

export type PushAutomationFormData = {
  eventKind: PushAutomationEventValue;
  triggerLimit: PushAutomationTriggerLimitValue;
  title: string;
  message: string;
};
