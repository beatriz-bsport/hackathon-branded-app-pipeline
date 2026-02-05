import { z } from "zod";

import {
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
  BookingAction,
  type BookingOccurrenceType,
  type BookingTemporality,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import {
  DEFAULT_TIMING_VALUE,
  type TimeUnitType,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/types";

import { i18nInstance } from "../i18n";
import type {
  BookingSelectableNotificationType,
  BookingTriggerConfigValidationFormData,
} from "./types";

export const bookingTriggerConfigValidationSchema = z
  .object({
    notificationType: z.custom<BookingSelectableNotificationType>(),
    bookingItemId: z.number(),
    bookingEventKind: z.number(),
    bookingActionType: z.custom<BookingAction>(),
    bookingOccurrenceType: z.custom<BookingOccurrenceType>(),
    bookingOccurrence: z.number().int({
      message: i18nInstance.t("steps.notificationRules.errors.noFloat", {
        ns: "sm-marketing-notification_marketingNotificationsModal",
      }),
    }),
    timingUnit: z.custom<TimeUnitType>(),
    timingValue: z.custom<number>(),
    timingTemporality: z.custom<BookingTemporality>(),
    toggleIncludedSmartlists: z.boolean(),
    includedSmartlists: z.array(z.number()).optional(),
    toggleExcludedSmartlists: z.boolean(),
    excludedSmartlists: z.array(z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.bookingOccurrenceType === BOOKING_OCCURENCE_SPECIFIC_AMOUNT &&
      data.bookingOccurrence === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          `steps.notificationRules.errors.bookingOccurence.atLeastOne.${data.bookingActionType}`,
          {
            timeUnit: data.timingUnit,
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["bookingOccurrence"],
      });
    }
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
  }) satisfies z.ZodType<BookingTriggerConfigValidationFormData>;

export type bookingTriggerConfigValidationFormSchema = z.infer<
  typeof bookingTriggerConfigValidationSchema
>;
