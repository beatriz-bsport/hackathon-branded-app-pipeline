import type { GiftcardFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 500,
  PRICE_MIN: 1,
  PRICE_MAX: 1500,
};

export const GIFTCARD_FORM_DATA_DEFAULT: GiftcardFormData = {
  name: "",
  description: "",
  hasCustomPrice: false,
  max_price: FIELD_CONSTRAINTS.PRICE_MAX,
  min_price: FIELD_CONSTRAINTS.PRICE_MIN,
  price: FIELD_CONSTRAINTS.PRICE_MIN,
};
