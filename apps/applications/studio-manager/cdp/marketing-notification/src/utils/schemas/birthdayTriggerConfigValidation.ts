import { z } from "zod";

import { i18nInstance } from "../i18n";
import type { CommonTriggerConfigValidationFormData } from "./types";

export const birthdayTriggerConfigValidationSchema = z
  .object({
    toggleIncludedSmartlists: z.boolean(),
    includedSmartlists: z.array(z.number()).optional(),
    toggleExcludedSmartlists: z.boolean(),
    excludedSmartlists: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
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
  }) satisfies z.ZodType<CommonTriggerConfigValidationFormData>;

export type BirthdayTriggerConfigValidationSchema = z.infer<
  typeof birthdayTriggerConfigValidationSchema
>;
