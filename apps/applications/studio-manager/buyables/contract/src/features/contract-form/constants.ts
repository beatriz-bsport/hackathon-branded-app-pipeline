import type { ContractFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_LENGTH_MIN: 1,
  NAME_LENGTH_MAX: 100,
  PRICE_MIN: 0,
  TAX_RATE_MIN: 0,
  TAX_RATE_MAX: 100,
};

export const DEFAULT_DATA = {
  name: "",
  description: "",
  payment_pack: null,
  payment_pack_details: {
    bookkeeping_account_id: null,
    tax: 0,
  },
  flat_fee: 0,
  recurrent_price: 0,
} satisfies ContractFormData;
