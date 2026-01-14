import { z } from "zod";

import type { ItemType } from "./types";

/**
 * Item type constants for form selection
 * These values are used throughout the codebase for type checking and validation
 * Export as const array to enable reuse and easy maintenance
 */
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
 * Schema for billing flow form data
 */
export const billingFlowFormDataSchema = z.object({
  memberId: z
    .number()
    .nullable()
    .refine((val: number | null) => val !== null && val > 0, {
      message: "Member is required",
    })
    .transform((val: number | null) => (val === null ? undefined : val)),
  items: z
    .array(invoiceItemFormDataSchema)
    .min(1, "At least one item is required"),
  couponCodes: z.array(z.string()),
  footnote: z.string().nullable(),
  date: z.string().min(1, "Invoice date is required"),
});

/**
 * Default form values
 */
export const DEFAULT_FORM_DATA: z.infer<typeof billingFlowFormDataSchema> = {
  memberId: undefined,
  items: [],
  couponCodes: [],
  footnote: null,
  date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
};

/**
 * Default invoice item form data
 */
export const DEFAULT_ITEM_FORM_DATA: z.infer<typeof invoiceItemFormDataSchema> =
  {
    type: "pass", // Default to pass for first item
    buyableItemId: null,
    quantity: 1,
    priceCts: 0,
    discountPercent: 0,
    discountAmountCts: 0,
    activationDate: null,
    billingDetail: null,
  };
