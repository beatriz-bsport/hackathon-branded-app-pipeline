import { z } from "zod";

import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

export const TEXTFIELD_MIN_LENGTH = 1;
export const FIELD_NAME_MAX_LENGTH = 200;
export const FIELD_DESCRIPTION_MAX_LENGTH = 2000;
export const FIELD_PRICE_MINIMUM = 0;
export const FIELD_TAX_RATE_MINIMUM = 0;
export const FIELD_TAX_RATE_MAXIMUM = 100;
export const FIELD_MAX_NB_PURCHASE_MINIMUM = 0;
export const PAYMENT_METHOD_IDENTIFIERS = {
  ONLINE_PAYMENTS_ID: 0,
  ONSITE_PAYMENTS_ID: 9,
} as const;

export const DEFAULT_FORM_DATA: Omit<PackFormData, "company"> = {
  description: "",
  name: "",
  available: true,
  is_usable_by_staff: true,
  manager_only: false,
  payment_pack_ids: [],
  private_pass_ids: [],
  shop_item_ids: [],
  price: 0,
  tax: 0,
  expiration_date: null,
  max_purchase_per_member: null,
  use_payment_combo_tax_on_items: false,
  available_payment_method_identifiers: [
    PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID,
  ],
  highlighted_as_recommended: false,
  new_member_only: false,
  tags_on_consumer_item_creation: [],
} satisfies Omit<PackFormData, "company">;

/** @todo Remove the Partial when all fields have been added */
export type PackFormSchema = z.ZodType<PackFormData>;

export const usePackSchema = () => {
  const { t } = useTranslation("details");

  return z.object({
    // Default values
    available: z.boolean(),
    company: z.number().nonnegative(),

    // Identity section
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
    available_payment_method_identifiers: z
      .array(z.coerce.number())
      .min(
        1,
        t("formFields.pricingSection.paymentMethod.errorMissingPaymentMethod"),
      ),

    // Visibility section
    expiration_date: z.string().nullable(),
    highlighted_as_recommended: z.boolean(),
    new_member_only: z.boolean(),
    is_usable_by_staff: z.boolean(),
    manager_only: z.boolean(),

    // Tags section
    tags_on_consumer_item_creation: z.array(z.number()),
  }) satisfies PackFormSchema;
};
