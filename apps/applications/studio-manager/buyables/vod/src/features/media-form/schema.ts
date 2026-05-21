import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { MediaFormSchema } from "./types";

export const useMediaFormSchema = (): MediaFormSchema => {
  const { t } = useTranslation("media-form");

  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
        .max(
          FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
          t("formFields.name.errorMaxLength", {
            maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
          }),
        ),
      description: z
        .string()
        .trim()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
        .max(
          FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
          t("formFields.description.errorMaxLength", {
            maxLength: FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
          }),
        ),
      credit_price: z
        .number()
        .min(
          FIELD_CONSTRAINTS.PRICE_MIN,
          t("formFields.credit_price.errorInvalid"),
        ),
      manager_only: z.boolean(),
      is_rental: z.boolean(),
      rental_days: z.number().int().min(FIELD_CONSTRAINTS.PRICE_MIN),
      cover: z
        .union([z.string(), z.instanceof(File)])
        .nullable()
        .refine((val) => val !== null, { message: requiredErrorMessage }),
      category: z.number({ invalid_type_error: requiredErrorMessage }),
      level: z.number().nullable(),
      coaches: z.array(z.number()),
    })
    .refine(
      (data) =>
        !data.is_rental ||
        data.rental_days >= FIELD_CONSTRAINTS.RENTAL_DAYS_MIN,
      {
        message: t("formFields.rental_days.errorInvalid", {
          min: FIELD_CONSTRAINTS.RENTAL_DAYS_MIN,
        }),
        path: ["rental_days"],
      },
    );
};
