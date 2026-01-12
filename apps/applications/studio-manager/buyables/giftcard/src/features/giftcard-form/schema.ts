import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormSchema } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 500,
};

export const useGiftcardFormSchema = () => {
  const { t } = useTranslation("giftcard-details");

  return z.object({
    // Identity section
    name: z
      .string()
      .min(
        FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH,
        t("formFields.genericErrors.fieldIsRequired"),
      )
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),
    description: z
      .string()
      .min(
        FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH,
        t("formFields.genericErrors.fieldIsRequired"),
      ),
  }) satisfies GiftcardFormSchema;
};
