import { PAYMENT_METHOD_IDENTIFIERS } from "@bsport/kaizen-business-components/buyables/payment-methods-form";

import type { GiftcardFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 500,
  PRICE_MIN: 1,
  PRICE_MAX: 1500,
  EXPIRATION_DAYS_MIN: 1,
};

export const GIFTCARD_FORM_DATA_DEFAULT: GiftcardFormData = {
  name: "",
  description: "",
  hasCustomPrice: false,
  max_price: FIELD_CONSTRAINTS.PRICE_MAX,
  min_price: FIELD_CONSTRAINTS.PRICE_MIN,
  price: FIELD_CONSTRAINTS.PRICE_MIN,
  hasExpirationDays: false,
  expiration_days: 365,
  cover: null,
  available_payment_method_identifiers: [
    PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID,
  ],
  tags_on_consumer_item_creation: [],
  manager_only: false,
  bookkeeping_account: null,
};
