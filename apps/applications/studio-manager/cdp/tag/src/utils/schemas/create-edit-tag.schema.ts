import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import type { CreateEditTagData } from "#src/utils/types";

export const TAG_NAME_MAX_LENGTH = 256;

export const createEditTagSchema = z.object({
  tagName: z
    .string()
    .max(TAG_NAME_MAX_LENGTH, {
      message: i18nInstance.t("tagModal.formField.tagName.errors.tooLong", {
        max: TAG_NAME_MAX_LENGTH,
      }),
    })
    .refine((value) => value.trim().length > 0, {
      message: i18nInstance.t("tagModal.formField.tagName.errors.required"),
    }),
  tagGroup: z.number().positive({
    message: i18nInstance.t(
      "tagModal.formField.mainTagAssociated.errors.required",
    ),
  }),
  color: z.string(),
}) satisfies z.ZodType<CreateEditTagData>;

export type CreateEditTagFormSchema = z.infer<typeof createEditTagSchema>;
