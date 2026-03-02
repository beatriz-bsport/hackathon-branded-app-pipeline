import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS, GIFTCARD_FORM_DATA_DEFAULT } from "./constants";
import type { GiftcardFormSchema } from "./types";

export const useGiftcardFormSchema = () => {
  const { t } = useTranslation("giftcard-details");
  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");

  const priceInput = z
    .number({
      required_error: requiredErrorMessage,
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

  const expirationDaysSchema = z.discriminatedUnion("hasExpirationDays", [
    // Case 1: hasExpirationDays = false → expiration_days is not expected
    z.object({
      hasExpirationDays: z.literal(false),
      expiration_days: z
        .number()
        .nullable()
        .transform(() => null),
    }),

    // Case 2: hasExpirationDays = true → expiration_days is required
    z.object({
      hasExpirationDays: z.literal(true),
      expiration_days: z
        .number({ required_error: requiredErrorMessage })
        .int()
        .min(FIELD_CONSTRAINTS.EXPIRATION_DAYS_MIN),
    }),
  ]);

  const paymentMethodsSchema = z.discriminatedUnion("manager_only", [
    // Case 1: manager_only = false → available_payment_method_identifiers have at least 1 item
    z.object({
      manager_only: z.literal(false),
      available_payment_method_identifiers: z
        .array(z.coerce.number())
        .min(1, t("formFields.errors.errorMissingPaymentMethod")),
    }),

    // Case 2: manager_only = true → available_payment_method_identifiers is defined to fallback
    z.object({
      manager_only: z.literal(true),
      available_payment_method_identifiers: z
        .array(z.coerce.number())
        .transform(
          () => GIFTCARD_FORM_DATA_DEFAULT.available_payment_method_identifiers,
        ),
    }),
  ]);

  return z
    .object({
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
        .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage),
      cover: z.custom<string | File>().nullable(),
      tags_on_consumer_item_creation: z.array(z.number()),
      bookkeeping_account: z.number().nullable(),
    })
    .and(expirationDaysSchema)
    .and(priceSchema)
    .and(paymentMethodsSchema) satisfies GiftcardFormSchema;
};
