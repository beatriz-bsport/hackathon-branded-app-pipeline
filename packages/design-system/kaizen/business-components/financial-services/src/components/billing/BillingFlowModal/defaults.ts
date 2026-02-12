import { z } from "zod";

import { getTodayJSDate } from "@bsport/datetime-manipulation";

import {
  type AddItemFieldsDefault,
  type GiftcardFieldsDefault,
  billingFlowFormDataSchema,
  invoiceItemFormDataSchema,
} from "./schema";

/**
 * Default values for the add-item section (builder state; not validated on submit).
 */
export const ADD_ITEM_DEFAULT = {
  addItemSelectedItemType: "pass",
  addItemSelectedItemId: null,
  addItemSelectedItemPriceCts: 0,
  addItemQuantity: 1,
  addItemPriceCts: 0,
  addItemSearchValue: "",
  addItemApplyDiscount: false,
  addItemDiscountPercent: 0,
  addItemDiscountAmountCts: 0,
  addItemDiscountReason: "",
  promoCode: "",
  promoCodeDiscountCts: 0,
} satisfies AddItemFieldsDefault;

/**
 * Default values for giftcard fields (used when resetting giftcard form)
 */
export const GIFTCARD_FIELDS_DEFAULT = {
  addItemGiftcardRecipientName: "",
  addItemGiftcardFrom: "",
  addItemGiftcardTo: "",
  addItemGiftcardPersonalMessage: "",
  addItemGiftcardDeliveryFormat: "pdf",
  addItemSelectedItemExpirationDays: null,
  // PDF-specific
  addItemGiftcardValidFrom: getTodayJSDate().toISOString(),
  // Email-specific
  addItemGiftcardBackgroundImage: null,
  addItemGiftcardRecipientEmails: [],
  addItemGiftcardScheduledDate: getTodayJSDate().toISOString(),
  addItemGiftcardScheduledTime: "07:00",
} satisfies GiftcardFieldsDefault;

/**
 * Default form values
 */
export const DEFAULT_FORM_DATA: z.infer<typeof billingFlowFormDataSchema> = {
  memberId: undefined,
  items: [],
  promoCodes: [],
  footnote: null,
  date: getTodayJSDate(),
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
