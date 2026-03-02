import { z } from "zod";

import { FIELD_CONSTRAINTS } from "#src/features/giftcard-form/constants";
import { GiftcardFormData } from "#src/features/giftcard-form/types";
import { useTranslation } from "#src/utils/i18n";

export type GiftcardFormNameSchema = z.ZodType<Pick<GiftcardFormData, "name">>;

/**
 * Create the same schema for the Name as in the global schema,
 * to inject in the Edit Name schema.
 */
export const useGiftcardNameSchema = () => {
  const { t } = useTranslation("giftcard-details");

  return z.object({
    // Identity section
    name: z
      .string()
      .min(
        FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH,
        t("formFields.errors.fieldIsRequired"),
      )
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),
  });
};
