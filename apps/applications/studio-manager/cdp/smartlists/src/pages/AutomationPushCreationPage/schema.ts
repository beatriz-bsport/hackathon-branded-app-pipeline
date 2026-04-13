import { z } from "zod";

import { getPushNotificationContentObjectSchema } from "#src/components/push-notification-generic-field/schema";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationFormData,
} from "./types";

const pushAutomationEventSchema = z.enum([
  PUSH_AUTOMATION_EVENT_VALUES.ENTRY,
  PUSH_AUTOMATION_EVENT_VALUES.EXIT,
]);

const pushAutomationTriggerLimitSchema = z.enum([
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
]);

export const pushAutomationSchema = z
  .object({
    eventKind: pushAutomationEventSchema,
    triggerLimit: pushAutomationTriggerLimitSchema,
  })
  .and(
    getPushNotificationContentObjectSchema(),
  ) satisfies z.ZodType<PushAutomationFormData>;

export type PushAutomationSchema = z.infer<typeof pushAutomationSchema>;
