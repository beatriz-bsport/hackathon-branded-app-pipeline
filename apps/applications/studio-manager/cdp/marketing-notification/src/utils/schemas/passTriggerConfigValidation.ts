import { z } from "zod";

import {
  PASS_ACTION_DAYS_LEFT,
  type PassAction,
  type PassCreditsLeftEventKind,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Pass/types";

import { i18nInstance } from "../i18n";
import type { PassesType } from "../types";
import type { PassTriggerConfigValidationFormData } from "./types";

export const passTriggerConfigValidationSchema = z
  .object({
    name: z.string({
      message: i18nInstance.t(
        "steps.notificationRules.pass.errors.notificationNameRequired",
        {
          ns: "sm-marketing-notification_marketingNotificationsModal",
        },
      ),
    }),
    passIds: z.array(z.number()),
    // Here we do not store the kind directly because the actions daysLeft and daysExpired share the same kind (3 or 5 based on passType) and there is no way of easily telling them apart in the form
    passEventAction: z.custom<PassAction>(),
    disabledInContract: z.boolean(),
    passesType: z.custom<PassesType>(),
    daysLeft: z.number().nonnegative().optional(),
    creditsLeft: z.number().nonnegative().optional(),
    hours: z.number().nonnegative().optional(),
    creditsEventKind: z.custom<PassCreditsLeftEventKind>().optional(),
    shouldContainAllPasses: z.boolean(),
    isPassExpirationCheck: z.boolean(),
    toggleIncludedSmartlists: z.boolean(),
    includedSmartlists: z.array(z.number()).optional(),
    toggleExcludedSmartlists: z.boolean(),
    excludedSmartlists: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.passEventAction === PASS_ACTION_DAYS_LEFT && data.daysLeft === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "steps.notificationRules.pass.errors.notEnoughDaysLeft",
          {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["daysLeft"],
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
  }) satisfies z.ZodType<PassTriggerConfigValidationFormData>;

export type PassTriggerConfigValidationFormSchema = z.infer<
  typeof passTriggerConfigValidationSchema
>;
