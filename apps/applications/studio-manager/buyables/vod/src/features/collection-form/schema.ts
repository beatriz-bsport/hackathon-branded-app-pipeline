import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { CollectionFormSchema } from "./types";

export const useCollectionFormSchema = (): CollectionFormSchema => {
  const { t } = useTranslation("collection-form");

  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");

  return z.object({
    name: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),
    description: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
      .max(
        FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
        t("formFields.description.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
        }),
      ),
    cover: z.custom<string | File>().nullable(),
  });
};
