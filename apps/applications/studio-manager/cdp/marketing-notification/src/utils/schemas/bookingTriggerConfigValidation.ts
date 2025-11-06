import { z } from "zod";

import type { BookingTemporality } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";

import { i18nInstance } from "../i18n";
import type {
  BookingSelectableNotificationType,
  BookingTriggerConfigValidationFormData,
  ConfigTimeUnit,
} from "./types";

export const bookingTriggerConfigValidationSchema = z
  .object({
    notificationType: z.custom<BookingSelectableNotificationType>(),
    bookingItemId: z.number(),
    bookingEventKind: z.number(),
    bookingOccurrence: z.number().int({
      message: i18nInstance.t("steps.notificationRules.errors.noFloat", {
        ns: "sm-marketing-notification_marketingNotificationsModal",
      }),
    }),
    timingUnit: z.custom<ConfigTimeUnit>(),
    timingValue: z.number(),
    timingTemporality: z.custom<BookingTemporality>(),
    toggleIncludedSmartlists: z.boolean(),
    includedSmartlists: z.array(z.number()).optional(),
    toggleExcludedSmartlists: z.boolean(),
    excludedSmartlists: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.timingValue < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "steps.notificationRules.errors.atLeastOneTimeValue",
          {
            timeUnit: data.timingUnit,
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["timingValue"],
      });
    }
    console.log("super refine");
    console.log(
      "checking data integrity for included smartlists : ",
      data.toggleIncludedSmartlists && !data.includedSmartlists,
    );

    if (
      data.toggleIncludedSmartlists &&
      (!data.includedSmartlists || data.includedSmartlists.length < 1)
    ) {
      console.log("toggleIncludedSmartlists triggered");
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
      console.log("toggleExcludedSmartlists triggered");

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
  }) satisfies z.ZodType<BookingTriggerConfigValidationFormData>;

export type bookingTriggerConfigValidationFormSchema = z.infer<
  typeof bookingTriggerConfigValidationSchema
>;
