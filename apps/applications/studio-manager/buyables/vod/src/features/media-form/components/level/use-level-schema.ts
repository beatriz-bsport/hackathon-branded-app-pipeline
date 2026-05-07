import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import type { LevelFormData } from "./types";

export const useLevelSchema = () => {
  const { t } = useTranslation("media-form");

  return z.object({
    name: z
      .string()
      .min(1, t("formFields.errors.fieldIsRequired"))
      .max(50, t("formFields.level.nameTooLong")),
    color: z.string(),
  }) satisfies z.ZodType<LevelFormData>;
};
