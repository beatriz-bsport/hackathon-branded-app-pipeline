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

/** Constants for validation. */
export const FROM_TO_MAX_LENGTH = 40;
export const NAME_AND_PERSONAL_MESSAGE_PDF_MAX_LENGTH = 150;
export const FOOTNOTE_MAX_LENGTH = 150;
export const PERSONAL_MESSAGE_EMAIL_MAX_LENGTH = 2000;

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
  startDateMethod: z.number().optional(),
});

/**
 * Schema for one line item in the billing flow (itemName, taxPercent, etc.).
 */
export const addedItemSchema = invoiceItemFormDataSchema
  .extend({
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
    startDateMethod: z.number().optional(),
    discountReason: z.string(),
    // Giftcard fields (required when type is giftcard)
    giftcardRecipientName: z.string().optional(),
    giftcardFrom: z.string().optional(),
    giftcardTo: z.string().optional(),
    giftcardPersonalMessage: z.string().optional(),
    giftcardDeliveryFormat: z.enum(["pdf", "email"]).optional(),
    expirationDays: z.number().nullable().optional(),
    // PDF-specific fields
    giftcardValidFrom: z.string().optional(),
    // Email-specific fields
    giftcardBackgroundImage: z.string().nullable().optional(),
    giftcardRecipientEmails: z.array(z.string()).optional(),
    giftcardScheduledDate: z.string().optional(),
    giftcardScheduledTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "giftcard") {
      // Check common required giftcard fields
      if (
        !data.giftcardRecipientName ||
        data.giftcardRecipientName.trim() === ""
      ) {
        ctx.addIssue({
          path: ["giftcardRecipientName"],
          code: "custom",
          message: "Recipient name is required for gift cards.",
        });
      }
      if (!data.giftcardFrom || data.giftcardFrom.trim() === "") {
        ctx.addIssue({
          path: ["giftcardFrom"],
          code: "custom",
          message: "Sender (from) is required for gift cards.",
        });
      }
      if (!data.giftcardTo || data.giftcardTo.trim() === "") {
        ctx.addIssue({
          path: ["giftcardTo"],
          code: "custom",
          message: "Recipient (to) is required for gift cards.",
        });
      }
      if (!data.giftcardDeliveryFormat) {
        ctx.addIssue({
          path: ["giftcardDeliveryFormat"],
          code: "custom",
          message: "Delivery format is required for gift cards.",
        });
      }

      // Delivery format specific fields
      if (data.giftcardDeliveryFormat === "pdf") {
        if (!data.giftcardValidFrom || data.giftcardValidFrom.trim() === "") {
          ctx.addIssue({
            path: ["giftcardValidFrom"],
            code: "custom",
            message: "Valid from date is required for PDF gift cards.",
          });
        }
      } else if (data.giftcardDeliveryFormat === "email") {
        if (
          !Array.isArray(data.giftcardRecipientEmails) ||
          data.giftcardRecipientEmails.length === 0
        ) {
          ctx.addIssue({
            path: ["giftcardRecipientEmails"],
            code: "custom",
            message:
              "At least one recipient email is required for email gift cards.",
          });
        } else {
          data.giftcardRecipientEmails.forEach((email, i) => {
            if (!email || typeof email !== "string" || email.trim() === "") {
              ctx.addIssue({
                path: ["giftcardRecipientEmails", i],
                code: "custom",
                message: "Recipient email must be a non-empty string.",
              });
            }
          });
        }
        if (
          data.giftcardBackgroundImage == null ||
          data.giftcardBackgroundImage === ""
        ) {
          ctx.addIssue({
            path: ["giftcardBackgroundImage"],
            code: "custom",
            message: "Background image is required for email gift cards.",
          });
        }
      }
    }
  }) satisfies z.ZodType<BillingFlowItem>;

/**
 * Schema for billing flow form data (submitted shape)
 */
export const billingFlowFormDataSchema = z.object({
  member: z
    .object({
      id: z.number().positive(),
      firstname: z.string().optional(),
      default_establishment_billing_group: z.number().nullable().optional(),
    })
    .nullable()
    .refine((val) => val != null && val.id > 0, {
      message: "Member is required",
    }),
  items: z.array(addedItemSchema).min(1, "At least one item is required"),
  promoCodes: z.array(z.string()),
  footnote: z.string().max(FOOTNOTE_MAX_LENGTH).nullable(),
  passActivationDate: z.date({
    required_error: "Pass activation date is required",
  }),
  establishmentBillingGroupId: z.number().nullable().default(null),
});

export type BillingFlowFormData = z.infer<typeof billingFlowFormDataSchema>;

export type AddItemFieldsDefault = {
  addItemSelectedItemType: ItemType | null;
  addItemSelectedItemId: string | null;
  addItemSelectedItemPriceCts: number;
  addItemQuantity: number;
  addItemPriceCts: number | null;
  addItemSearchValue: string;
  addItemApplyDiscount: boolean;
  addItemDiscountPercent: number;
  addItemDiscountAmountCts: number;
  addItemDiscountReason: string;
  promoCode: string;
  promoCodeDiscountCts: number;
};

export type GiftcardFieldsDefault = {
  addItemGiftcardRecipientName: string;
  addItemGiftcardFrom: string;
  addItemGiftcardTo: string;
  addItemGiftcardPersonalMessage: string;
  addItemGiftcardDeliveryFormat: "pdf" | "email";
  addItemSelectedItemExpirationDays: number | null;
  addItemGiftcardValidFrom: string;
  addItemGiftcardBackgroundImage: string | null;
  addItemGiftcardRecipientEmails: string[];
  addItemGiftcardScheduledDate: string;
  addItemGiftcardScheduledTime: string;
};

export type BillingFlowBuilderState = AddItemFieldsDefault &
  GiftcardFieldsDefault & {
    isDiscountReasonRequired: boolean;
  };

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
  promoCode: z.string(),
  promoCodeDiscountCts: z.number(),
  // Giftcard fields (common)
  addItemGiftcardRecipientName: z.string(),
  addItemGiftcardFrom: z.string().max(FROM_TO_MAX_LENGTH),
  addItemGiftcardTo: z.string().max(FROM_TO_MAX_LENGTH),
  addItemGiftcardPersonalMessage: z.string(),
  addItemGiftcardDeliveryFormat: z.enum(["pdf", "email"]),
  addItemSelectedItemExpirationDays: z.number().nullable(),
  // Giftcard fields (PDF only)
  addItemGiftcardValidFrom: z.string(),
  // Giftcard fields (email only)
  addItemGiftcardBackgroundImage: z.string().nullable(),
  addItemGiftcardRecipientEmails: z.array(z.string()),
  addItemGiftcardScheduledDate: z.string(),
  addItemGiftcardScheduledTime: z.string(),
}) satisfies z.ZodType<BillingFlowBuilderState>;

/** Full form state schema (submitted shape + builder state) for useFormController defaultValues. */
export const billingFlowFormStateSchema = billingFlowFormDataSchema.merge(
  billingFlowBuilderStateSchema,
);

/** Inferred type for form state. */
export type BillingFlowFormState = BillingFlowFormData &
  BillingFlowBuilderState;

/**
 * Price input pattern (UI-level): allow empty, integers, or decimals with up to 2 digits.
 * Accepts both dot and comma as decimal separators.
 */
export const PRICE_INPUT_PATTERN = /^\d*(?:[.,]\d{0,2})?$/;
