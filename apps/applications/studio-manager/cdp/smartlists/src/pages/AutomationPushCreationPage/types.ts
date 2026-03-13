import { EventKind } from "#src/api/constants";

export const PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH = 150;
export const PUSH_AUTOMATION_MAX_TITLE_LENGTH = 25;
export const PUSH_AUTOMATION_MAX_MESSAGE_LENGTH = 200;

export const PUSH_AUTOMATION_EVENT_VALUES = {
  ENTRY: String(EventKind.JOIN),
  EXIT: String(EventKind.LEAVE),
} as const;

export type PushAutomationEventValue =
  (typeof PUSH_AUTOMATION_EVENT_VALUES)[keyof typeof PUSH_AUTOMATION_EVENT_VALUES];

export const isPushAutomationEventValue = (
  value: string,
): value is PushAutomationEventValue => {
  return (
    value === PUSH_AUTOMATION_EVENT_VALUES.ENTRY ||
    value === PUSH_AUTOMATION_EVENT_VALUES.EXIT
  );
};

export type PushAutomationFormData = {
  automationName: string;
  eventKind: PushAutomationEventValue;
  title: string;
  message: string;
};
