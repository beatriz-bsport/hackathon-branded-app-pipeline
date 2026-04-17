import { z } from "zod";

import {
  emailChannelSchema,
  emailMessageContentSchema,
} from "#src/components/EmailCampaignForm/schema";

import {
  type AutomationEmailFormData,
  EMAIL_AUTOMATION_EVENT_VALUES,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES,
} from "./types";

const emailAutomationEventSchema = z.enum([
  EMAIL_AUTOMATION_EVENT_VALUES.ENTRY,
  EMAIL_AUTOMATION_EVENT_VALUES.EXIT,
]);

const emailAutomationTriggerLimitSchema = z.enum([
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
]);

export const automationEmailSchema = z
  .object({
    eventKind: emailAutomationEventSchema,
    triggerLimit: emailAutomationTriggerLimitSchema,
  })
  .and(emailChannelSchema)
  .and(emailMessageContentSchema) satisfies z.ZodType<AutomationEmailFormData>;

export type AutomationEmailSchema = z.infer<typeof automationEmailSchema>;
