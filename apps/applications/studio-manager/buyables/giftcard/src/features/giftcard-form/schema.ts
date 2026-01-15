import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { GiftcardFormSchema } from "./types";

export const useGiftcardFormSchema = () => {
  const { t } = useTranslation("giftcard-details");

  const priceInput = z
    .number({
      required_error: t("formFields.genericErrors.fieldIsRequired"),
    })
    .int()
    .min(FIELD_CONSTRAINTS.PRICE_MIN)
    .max(FIELD_CONSTRAINTS.PRICE_MAX);

  // Enforce right typing and remove constraints validation by enforcing final null value
  const nullPriceInput = z
    .number()
    .nullable()
    .transform(() => null);

  const priceSchema = z
    .discriminatedUnion("hasCustomPrice", [
      // Case 1: hasCustomPrice = false → price is required
      z.object({
        hasCustomPrice: z.literal(false),
        price: priceInput,
        min_price: nullPriceInput,
        max_price: nullPriceInput,
      }),

      // Case 2: hasCustomPrice = true → min_price & max_price are required
      z.object({
        hasCustomPrice: z.literal(true),
        price: nullPriceInput,
        min_price: priceInput,
        max_price: priceInput,
      }),
    ])
    .superRefine((values, context) => {
      if (values.hasCustomPrice && values.max_price < values.min_price) {
        // Raising an issue will block the Zod validation
        context.addIssue({
          message: t("formFields.customValue.minMaxError"),
          code: z.ZodIssueCode.custom,
        });
      }
    });

  return z
    .object({
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
    })
    .and(priceSchema) satisfies GiftcardFormSchema;
};
