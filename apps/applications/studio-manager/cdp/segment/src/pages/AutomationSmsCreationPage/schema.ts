import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import {
  SMS_AUTOMATION_EVENT_VALUES,
  SMS_AUTOMATION_MAX_MESSAGE_LENGTH,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type SmsAutomationFormData,
} from "./types";

const smsAutomationEventSchema = z.enum([
  SMS_AUTOMATION_EVENT_VALUES.ENTRY,
  SMS_AUTOMATION_EVENT_VALUES.EXIT,
]);

const smsAutomationTriggerLimitSchema = z.enum([
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
]);

export const smsAutomationSchema = z.object({
  eventKind: smsAutomationEventSchema,
  triggerLimit: smsAutomationTriggerLimitSchema,
  message: z
    .string()
    .trim()
    .min(
      1,
      i18nInstance.t("automation.sms.form.message.required", {
        ns: "sm-smartlists_details",
      }),
    )
    .max(
      SMS_AUTOMATION_MAX_MESSAGE_LENGTH,
      i18nInstance.t("automation.sms.form.message.maxLength", {
        ns: "sm-smartlists_details",
      }),
    ),
}) satisfies z.ZodType<SmsAutomationFormData>;

export type SmsAutomationSchema = z.infer<typeof smsAutomationSchema>;
