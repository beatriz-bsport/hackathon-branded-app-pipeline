import { z } from "zod";

import { i18nInstance } from "../i18n";
import type { NotificationContentFormData } from "./types";

export const notificationContentValidationFormSchema = z
  .object({
    isPushNotificationChecked: z.boolean(),
    isEmailNotificationChecked: z.boolean(),
    pushNotificationTitle: z.string().optional(),
    pushNotificationContent: z.string().optional(),
    emailTemplateId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const isEmailNotificationEnabled = data.isEmailNotificationChecked;
    const isPushNotificationEnabled = data.isPushNotificationChecked;
    const isEmailNotificationWrongSetup =
      isEmailNotificationEnabled && !data.emailTemplateId;
    const isPushNotificationWrongSetup =
      isPushNotificationEnabled &&
      (!data.pushNotificationContent || !data.pushNotificationTitle);
    if (!isEmailNotificationEnabled && !isPushNotificationEnabled) {
      const missingFields = [
        !data.pushNotificationContent && "pushNotificationContent",
        !data.pushNotificationTitle && "pushNotificationTitle",
      ].filter(Boolean) as Array<keyof NotificationContentFormData>;

      missingFields.forEach((field) =>
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18nInstance.t("steps.content.errors.noContentKind", {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          }),
          path: [field],
        }),
      );
    }
    if (isEmailNotificationWrongSetup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t("steps.content.errors.noEmailTemplate", {
          ns: "sm-marketing-notification_marketingNotificationsModal",
        }),
        path: ["emailTemplateId"],
      });
    }
    if (isPushNotificationWrongSetup) {
      const emptyPushNotificationField = [
        !data.pushNotificationContent ? "pushNotificationContent" : "",
        !data.pushNotificationTitle ? "pushNotificationTitle" : "",
      ];
      emptyPushNotificationField.forEach((field) =>
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18nInstance.t(`steps.content.errors.noContent.${field}`, {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          }),
          path: [field],
        }),
      );
    }
  }) satisfies z.ZodType<NotificationContentFormData>;

export type NotificationContentValidationFormSchema = z.infer<
  typeof notificationContentValidationFormSchema
>;
