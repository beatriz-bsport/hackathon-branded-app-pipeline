import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH,
  PUSH_AUTOMATION_MAX_MESSAGE_LENGTH,
  PUSH_AUTOMATION_MAX_TITLE_LENGTH,
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

export const pushAutomationSchema = z.object({
  automationName: z
    .string()
    .trim()
    .min(
      1,
      i18nInstance.t("automation.push.form.automationName.required", {
        ns: "sm-smartlists_details",
      }),
    )
    .max(
      PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH,
      i18nInstance.t("automation.push.form.automationName.maxLength", {
        ns: "sm-smartlists_details",
      }),
    ),
  eventKind: pushAutomationEventSchema,
  triggerLimit: pushAutomationTriggerLimitSchema,
  title: z
    .string()
    .trim()
    .min(
      1,
      i18nInstance.t("automation.push.form.title.required", {
        ns: "sm-smartlists_details",
      }),
    )
    .max(
      PUSH_AUTOMATION_MAX_TITLE_LENGTH,
      i18nInstance.t("automation.push.form.title.maxLength", {
        ns: "sm-smartlists_details",
      }),
    ),
  message: z
    .string()
    .trim()
    .min(
      1,
      i18nInstance.t("automation.push.form.message.required", {
        ns: "sm-smartlists_details",
      }),
    )
    .max(
      PUSH_AUTOMATION_MAX_MESSAGE_LENGTH,
      i18nInstance.t("automation.push.form.message.maxLength", {
        ns: "sm-smartlists_details",
      }),
    ),
}) satisfies z.ZodType<PushAutomationFormData>;

export type PushAutomationSchema = z.infer<typeof pushAutomationSchema>;
