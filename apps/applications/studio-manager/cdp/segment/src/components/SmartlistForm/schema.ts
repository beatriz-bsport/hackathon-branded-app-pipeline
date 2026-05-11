import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { SmartlistFormData } from "./shared-types";

const MAX_NAME_LENGTH = 200;

export const smartlistSchema = z.object({
  name: z
    .string()
    .min(1, i18nInstance.t("editForm.fields.name.required"))
    .max(MAX_NAME_LENGTH, i18nInstance.t("editForm.fields.name.maxLength"))
    .refine((val) => val.trim().length > 0, {
      message: i18nInstance.t("editForm.fields.name.required"),
    }),
  description: z.string(),
}) satisfies z.ZodType<SmartlistFormData>;

export type SmartlistFormSchema = z.infer<typeof smartlistSchema>;
