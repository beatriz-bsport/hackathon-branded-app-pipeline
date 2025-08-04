import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { CustomFormCreationData } from "./types";

const MAX_NAME_LENGTH = 100;

export const customFormCreationSchema = z.object({
  name: z
    .string()
    .min(
      1,
      i18nInstance.t("activeList.addFormModal.errors.nameTooShort", {
        minimalLength: 1,
      }),
    )
    .max(
      MAX_NAME_LENGTH,
      i18nInstance.t("activeList.addFormModal.errors.nameTooLong", {
        maximalLength: MAX_NAME_LENGTH,
      }),
    )
    .refine((val) => val.trim().length > 0, {
      message: i18nInstance.t("activeList.addFormModal.errors.nameRequired"),
    }),
}) satisfies z.ZodType<CustomFormCreationData>;

export type CustomFormCreationSchema = z.infer<typeof customFormCreationSchema>;
