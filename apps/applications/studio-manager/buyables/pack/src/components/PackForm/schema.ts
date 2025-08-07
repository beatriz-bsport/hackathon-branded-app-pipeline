import { z } from "zod";

import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

export const TEXTFIELD_MIN_LENGTH = 1;
export const FIELD_NAME_MAX_LENGTH = 200;
export const FIELD_DESCRIPTION_MAX_LENGTH = 2000;

export const usePackSchema = () => {
  const { t } = useTranslation("details");

  return z.object({
    name: z
      .string()
      .min(TEXTFIELD_MIN_LENGTH, t("formFields.requiredField"))
      .max(FIELD_NAME_MAX_LENGTH, t("formFields.name.errorMaxLength")),
    description: z
      .string()
      .min(TEXTFIELD_MIN_LENGTH, t("formFields.requiredField"))
      .max(
        FIELD_DESCRIPTION_MAX_LENGTH,
        t("formFields.description.errorMaxLength"),
      ),
  }) satisfies z.ZodType<
    Partial<PackFormData>
  >; /** @todo Remove the Partial when all fields have been added */
};
