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
    // includedSmartlists: z.array(z.number()).optional(),
    // excludedSmartlists: z.array(z.number()).optional(),
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
  }) satisfies z.ZodType<BookingTriggerConfigValidationFormData>;

export type bookingTriggerConfigValidationFormSchema = z.infer<
  typeof bookingTriggerConfigValidationSchema
>;
