import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import "#src/utils/types";
import { PushNotificationFormData } from "#src/utils/types";

const PUSH_NOTIFICATION_TITLE_MIN_LENGTH = 1;
const PUSH_NOTIFICATION_CONTENT_MIN_LENGTH = 1;
export const PUSH_NOTIFICATION_TITLE_MAX_LENGTH = 25;
export const PUSH_NOTIFICATION_CONTENT_MAX_LENGTH = 200;

export const pushNotificationFormSchema = z.object({
  title: z
    .string()
    .min(PUSH_NOTIFICATION_TITLE_MIN_LENGTH, {
      message: i18nInstance.t(
        "notificationRuleEventDetails.details.pushNotification.title.errors.minLength",
      ),
    })
    .max(PUSH_NOTIFICATION_TITLE_MAX_LENGTH, {
      message: i18nInstance.t(
        "notificationRuleEventDetails.details.pushNotification.title.errors.maxLength",
      ),
    }),
  content: z
    .string()
    .min(PUSH_NOTIFICATION_CONTENT_MIN_LENGTH, {
      message: i18nInstance.t(
        "notificationRuleEventDetails.details.pushNotification.content.errors.minLength",
      ),
    })
    .max(PUSH_NOTIFICATION_CONTENT_MAX_LENGTH, {
      message: i18nInstance.t(
        "notificationRuleEventDetails.details.pushNotification.content.errors.maxLength",
      ),
    }),
}) satisfies z.ZodType<PushNotificationFormData>;

export type PushNotificationFormSchema = z.infer<
  typeof pushNotificationFormSchema
>;
