import { z } from "zod";

import type { BillingFlowItem, ItemType } from "./types";

/** Item type constants for form selection. */
export const ITEM_TYPES = [
  "pass",
  "appointment_pass",
  "product",
  "pack",
  "giftcard",
  "subscription",
] as const satisfies readonly ItemType[];

/**
 * Schema for invoice item form data
 */
export const invoiceItemFormDataSchema = z.object({
  type: z.enum(ITEM_TYPES),
  buyableItemId: z.number().positive().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  priceCts: z
    .number()
    .int("Price must be a whole number of cents")
    .min(0, "Price must be greater than or equal to 0"),
  discountPercent: z
    .number()
    .int()
    .min(0, "Discount percent must be between 0 and 100")
    .max(100, "Discount percent must be between 0 and 100"),
  discountAmountCts: z
    .number()
    .int("Discount amount must be a whole number of cents")
    .min(0, "Discount amount must be greater than or equal to 0"),
  activationDate: z.string().nullable(),
  billingDetail: z.string().nullable(),
});

/**
 * Schema for one line item in the billing flow (itemName, taxPercent, etc.).
 */
export const addedItemSchema = invoiceItemFormDataSchema.extend({
  buyableItemId: z.number().positive(),
  activationDate: z.null(),
  billingDetail: z.null(),
  itemName: z.string(),
  taxPercent: z.number().optional(),
  credits: z.number().nullish(),
  durationDays: z.number().nullish(),
  durationMonths: z.number().nullish(),
  durationYears: z.number().nullish(),
  validityDateRange: z
    .object({ lower: z.string(), upper: z.string() })
    .nullish(),
}) satisfies z.ZodType<BillingFlowItem>;

/**
 * Schema for billing flow form data (submitted shape)
 */
export const billingFlowFormDataSchema = z.object({
  memberId: z
    .number()
    .nullable()
    .refine((val: number | null) => val !== null && val > 0, {
      message: "Member is required",
    })
    .transform((val: number | null) => (val === null ? undefined : val)),
  items: z.array(addedItemSchema).min(1, "At least one item is required"),
  couponCodes: z.array(z.string()),
  footnote: z.string().nullable(),
  date: z.date({ required_error: "Invoice date is required" }),
});

/** Builder state (not validated on submit). */
const billingFlowBuilderStateSchema = z.object({
  addItemSelectedItemType: z.enum(ITEM_TYPES).nullable(),
  addItemSelectedItemId: z.string().nullable(),
  addItemSelectedItemPriceCts: z.number(),
  addItemQuantity: z.number(),
  addItemPriceCts: z.number().min(0).nullable(),
  addItemSearchValue: z.string(),
  addItemApplyDiscount: z.boolean(),
  addItemDiscountPercent: z.number(),
  addItemDiscountAmountCts: z.number(),
  addItemDiscountReason: z.string(),
  isDiscountReasonRequired: z.boolean(),
});

/** Full form state schema (submitted shape + builder state) for useFormController defaultValues. */
export const billingFlowFormStateSchema = billingFlowFormDataSchema.merge(
  billingFlowBuilderStateSchema,
);

/** Inferred type for form state. */
export type BillingFlowFormState = z.infer<typeof billingFlowFormStateSchema>;

/**
 * Price input pattern (UI-level): allow empty, integers, or decimals with up to 2 digits.
 * Accepts both dot and comma as decimal separators.
 */
export const PRICE_INPUT_PATTERN = /^\d*(?:[.,]\d{0,2})?$/;
