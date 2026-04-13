import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import {
  PUSH_NOTIFICATION_MAX_MESSAGE_LENGTH,
  PUSH_NOTIFICATION_MAX_TITLE_LENGTH,
} from "./constants";
import type { PushNotificationContentFormData } from "./types";

export const getPushNotificationContentObjectSchema = () =>
  z.object({
    title: z
      .string()
      .trim()
      .min(
        1,
        i18nInstance.t("generic.pushNotification.form.title.required", {
          ns: "sm-smartlists_details",
        }),
      )
      .max(
        PUSH_NOTIFICATION_MAX_TITLE_LENGTH,
        i18nInstance.t("generic.pushNotification.form.title.maxLength", {
          ns: "sm-smartlists_details",
        }),
      ),
    message: z
      .string()
      .trim()
      .min(
        1,
        i18nInstance.t("generic.pushNotification.form.message.required", {
          ns: "sm-smartlists_details",
        }),
      )
      .max(
        PUSH_NOTIFICATION_MAX_MESSAGE_LENGTH,
        i18nInstance.t("generic.pushNotification.form.message.maxLength", {
          ns: "sm-smartlists_details",
        }),
      ),
  }) satisfies z.ZodType<PushNotificationContentFormData>;
