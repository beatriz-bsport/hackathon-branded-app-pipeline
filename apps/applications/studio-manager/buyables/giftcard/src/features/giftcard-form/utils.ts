import {
  type CreateGiftcardKeys,
  GIFTCARD_TYPES,
  type Giftcard,
} from "@bsport/store-buyables-giftcard";

import { GIFTCARD_FORM_DATA_DEFAULT } from "./constants";
import type { GiftcardFormData } from "./types";

/**
 * Transform: form state values into API FormData
 * Ensuring we are adding the right keys by using API type
 */
export function transformFormStateIntoAPIData(
  formState: GiftcardFormData,
): FormData {
  const formData = new FormData();

  // Sanitize prices formState to correspond to backend
  const { price, minPrice, maxPrice, cardType } = formState.hasCustomPrice
    ? {
        minPrice: formState.min_price,
        maxPrice: formState.max_price,
        price: null,
        cardType: GIFTCARD_TYPES.CUSTOM,
      }
    : {
        minPrice: null,
        maxPrice: null,
        price: formState.price,
        cardType: GIFTCARD_TYPES.FIXED,
      };

  // Function to add an entry to the form data
  function appendField(key: keyof CreateGiftcardKeys, value: unknown) {
    if (value === undefined || value === null) {
      return; // skip nulls (or use formData.append(key, '') if backend wants empty)
    }

    if (value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Append a [] at the end of the key to inform it's array
      formData.append(`${key}[]`, JSON.stringify(value));
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      // number, string, boolean
      formData.append(key, String(value));
    }
  }

  // Append fields
  appendField("name", formState.name);
  appendField("description", formState.description);
  appendField("price", price);
  appendField("manager_only", formState.manager_only);
  appendField(
    "expiration_days",
    formState.hasExpirationDays ? formState.expiration_days : "",
  );
  appendField("bookkeeping_account", formState.bookkeeping_account);
  appendField(
    "available_payment_method_identifiers",
    formState.available_payment_method_identifiers,
  );
  appendField(
    "tags_on_consumer_item_creation",
    formState.tags_on_consumer_item_creation,
  );
  appendField("min_price", minPrice);
  appendField("max_price", maxPrice);
  appendField("card_type", cardType);

  // Cover: only append if it's a file (not an existing URL)
  if (formState.cover && typeof formState.cover !== "string") {
    appendField("cover", formState.cover);
  }

  return formData;
}

export function transformGiftcardIntoFormState(
  giftcard: Giftcard,
): GiftcardFormData {
  const { price, min_price, max_price, ...otherFields } = giftcard;
  return {
    ...otherFields,
    price:
      price != null && typeof price === "string"
        ? parseInt(price, 10)
        : GIFTCARD_FORM_DATA_DEFAULT.price,
    min_price:
      min_price != null ? min_price : GIFTCARD_FORM_DATA_DEFAULT.min_price,
    max_price:
      max_price != null ? max_price : GIFTCARD_FORM_DATA_DEFAULT.max_price,
    hasCustomPrice: giftcard.card_type === GIFTCARD_TYPES.CUSTOM,
    hasExpirationDays: giftcard.expiration_days != null,
  };
}
