import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import type { CreateEditTagGroupData } from "#src/utils/types";

export const TAG_GROUP_NAME_MAX_LENGTH = 256;

export const createEditTagGroupSchema = z.object({
  tagGroupName: z
    .string()
    .max(TAG_GROUP_NAME_MAX_LENGTH, {
      message: i18nInstance.t(
        "tagGroupModal.formField.tagGroupName.errors.tooLong",
        { max: TAG_GROUP_NAME_MAX_LENGTH },
      ),
    })
    .refine((value) => value.trim().length > 0, {
      message: i18nInstance.t(
        "tagGroupModal.formField.tagGroupName.errors.required",
      ),
    }),
}) satisfies z.ZodType<CreateEditTagGroupData>;

export type CreateEditTagGroupFormSchema = z.infer<
  typeof createEditTagGroupSchema
>;
