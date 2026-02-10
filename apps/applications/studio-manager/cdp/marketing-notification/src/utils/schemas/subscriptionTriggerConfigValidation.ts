import { z } from "zod";

import {
  DEFAULT_TIMING_VALUE,
  type TemporalityType,
  type TimeUnitType,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/types";

import { i18nInstance } from "../i18n";
import type { SubscriptionTriggerConfigValidationFormData } from "./types";

export const subscriptionTriggerConfigValidationSchema = z
  .object({
    contractId: z.number(),
    subscriptionEventKind: z.number(),
    timingUnit: z.custom<TimeUnitType>(),
    timingValue: z.custom<number>(),
    timingTemporality: z.custom<TemporalityType>(),
    toggleIncludedSmartlists: z.boolean(),
    includedSmartlists: z.array(z.number()).optional(),
    toggleExcludedSmartlists: z.boolean(),
    excludedSmartlists: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    const timingValue = data.timingValue;
    if (
      typeof timingValue !== "number" ||
      Number.isNaN(timingValue) ||
      timingValue < DEFAULT_TIMING_VALUE
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          `steps.notificationRules.errors.positiveValue.${data.timingUnit}`,
          {
            timeUnit: data.timingUnit,
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["timingValue"],
      });
    }
    if (
      data.toggleIncludedSmartlists &&
      (!data.includedSmartlists || data.includedSmartlists.length < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "steps.notificationRules.errors.smartlistShouldBeFilledWhenToggled",
          {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["includedSmartlists"],
      });
    }
    if (
      data.toggleExcludedSmartlists &&
      (!data.excludedSmartlists || data.excludedSmartlists.length < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "steps.notificationRules.errors.smartlistShouldBeFilledWhenToggled",
          {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["excludedSmartlists"],
      });
    }
  }) satisfies z.ZodType<SubscriptionTriggerConfigValidationFormData>;

export type SubscriptionTriggerConfigValidationFormSchema = z.infer<
  typeof subscriptionTriggerConfigValidationSchema
>;
