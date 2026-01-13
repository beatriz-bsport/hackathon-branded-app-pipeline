import { z } from "zod";

import type { SelectableNotificationType } from "#src/utils/types";

import { NOTIFICATION_ADVANCED_TYPE } from "../constants";
import { i18nInstance } from "../i18n";
import type { TriggerTypeValidationFormData } from "./types";

export const triggerTypeValidationFormSchema = z
  .object({
    itemIds: z.array(z.number()).optional(),
    notificationType: z.custom<SelectableNotificationType>(),
    shouldContainAllPasses: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const itemIdsLength = data.itemIds ? data.itemIds.length : 0;
    if (
      !data.shouldContainAllPasses &&
      itemIdsLength < 1 &&
      (data.notificationType === NOTIFICATION_ADVANCED_TYPE.paymentPack ||
        data.notificationType === NOTIFICATION_ADVANCED_TYPE.privatePass)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "steps.triggerType.selectors.errors.atLeastOne",
          {
            ns: "sm-marketing-notification_marketingNotificationsModal",
          },
        ),
        path: ["itemIds"],
      });
    } else if (
      !data.shouldContainAllPasses &&
      itemIdsLength < 1 &&
      data.notificationType !== NOTIFICATION_ADVANCED_TYPE.birthday
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t("steps.triggerType.selectors.errors.notEmpty", {
          ns: "sm-marketing-notification_marketingNotificationsModal",
        }),
        path: ["itemIds"],
      });
    }
  }) satisfies z.ZodType<TriggerTypeValidationFormData>;

export type TriggerTypeValidationFormSchema = z.infer<
  typeof triggerTypeValidationFormSchema
>;
