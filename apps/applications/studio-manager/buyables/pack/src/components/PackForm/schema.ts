import { z } from "zod";

import { fromIsoString } from "@bsport/datetime-manipulation";
import { PAYMENT_METHOD_IDENTIFIERS } from "@bsport/kaizen-business-components/buyables/payment-methods-form";
import type {
  PackFormData as PackFormDataAPI,
  PackFormEditData as PackFormEditDataAPI,
} from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { useGetDisablePast } from "./utils";

export const TEXTFIELD_MIN_LENGTH = 1;
export const FIELD_NAME_MAX_LENGTH = 200;
export const FIELD_DESCRIPTION_MAX_LENGTH = 2000;
export const FIELD_PRICE_MINIMUM = 0;
export const FIELD_TAX_RATE_MINIMUM = 0;
export const FIELD_TAX_RATE_MAXIMUM = 100;
export const FIELD_MAX_NB_PURCHASE_MINIMUM = 0;

export type PackFormData = PackFormDataAPI & { hasExpirationDate: boolean };
export type PackFormEditData = PackFormEditDataAPI & {
  hasExpirationDate: boolean;
};

export const DEFAULT_FORM_DATA = {
  description: "",
  name: "",
  is_usable_by_staff: true,
  manager_only: false,
  payment_pack_ids: [],
  private_pass_ids: [],
  shop_item_ids: [],
  price: 0,
  tax: 0,
  hasExpirationDate: false,
  expiration_date: null,
  max_purchase_per_member: null,
  use_payment_combo_tax_on_items: false,
  available_payment_method_identifiers: [
    PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID,
  ],
  highlighted_as_recommended: false,
  new_member_only: false,
  tags_on_consumer_item_creation: [],
} satisfies PackFormData & { hasExpirationDate: boolean };

export type PackFormSchema = z.ZodType<PackFormData>;

export const usePackSchema = () => {
  const { t } = useTranslation("details");
  const requiredErrorMessage = t("formFields.requiredField");

  const disablePast = useGetDisablePast();

  const errorMissingDate = t(
    "formFields.visibilitySection.dateLimitSelector.errorMissingDate",
  );
  const expirationDateInput = z.discriminatedUnion("hasExpirationDate", [
    // Case 1: hasExpirationDate = false → expiration_date is not expected
    z.object({
      hasExpirationDate: z.literal(false),
      expiration_date: z
        .string()
        .nullable()
        .transform(() => null),
    }),

    // Case 2: hasExpirationDate = true → expiration_date is required, and to be in the future
    z.object({
      hasExpirationDate: z.literal(true),
      expiration_date: z
        .string({
          required_error: errorMissingDate,
          invalid_type_error: errorMissingDate,
        })
        .refine(
          (date: string | null) => {
            if (!date) {
              return false;
            }
            return !disablePast(fromIsoString(date));
          },
          (date: string | null) => {
            const message = date
              ? t(
                  "formFields.visibilitySection.dateLimitSelector.errorPastDate",
                )
              : errorMissingDate;
            return { message };
          },
        ),
    }),
  ]);

  const paymentMethodsSchema = z.discriminatedUnion("manager_only", [
    // Case 1: manager_only = false → available_payment_method_identifiers have at least 1 item
    z.object({
      manager_only: z.literal(false),
      available_payment_method_identifiers: z
        .array(z.coerce.number())
        .min(
          1,
          t(
            "formFields.pricingSection.paymentMethod.errorMissingPaymentMethod",
          ),
        ),
    }),

    // Case 2: manager_only = true → available_payment_method_identifiers is defined to fallback
    z.object({
      manager_only: z.literal(true),
      available_payment_method_identifiers: z
        .array(z.coerce.number())
        .transform(
          () => DEFAULT_FORM_DATA.available_payment_method_identifiers,
        ),
    }),
  ]);

  return z
    .object({
      // Identity section
      name: z
        .string()
        .min(TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
        .max(FIELD_NAME_MAX_LENGTH, t("formFields.name.errorMaxLength")),
      description: z
        .string()
        .min(TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
        .max(
          FIELD_DESCRIPTION_MAX_LENGTH,
          t("formFields.description.errorMaxLength"),
        ),

      // Content section
      payment_pack_ids: z.array(z.number()),
      private_pass_ids: z.array(z.number()),
      shop_item_ids: z.array(z.number()),

      // Pricing section
      price: z.coerce.number().min(FIELD_PRICE_MINIMUM),
      tax: z.coerce
        .number()
        .min(FIELD_TAX_RATE_MINIMUM)
        .max(FIELD_TAX_RATE_MAXIMUM),
      max_purchase_per_member: z.coerce
        .number()
        .min(FIELD_MAX_NB_PURCHASE_MINIMUM)
        .nullable(),
      use_payment_combo_tax_on_items: z.boolean(),

      // Visibility section
      highlighted_as_recommended: z.boolean(),
      new_member_only: z.boolean(),
      is_usable_by_staff: z.boolean(),
      manager_only: z.boolean(),

      // Tags section
      tags_on_consumer_item_creation: z.array(z.number()),
    })
    .and(expirationDateInput)
    .and(paymentMethodsSchema) satisfies PackFormSchema;
};
