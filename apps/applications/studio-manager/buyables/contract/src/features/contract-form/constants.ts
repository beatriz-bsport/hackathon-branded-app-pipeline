import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";

import type { ContractFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_LENGTH_MIN: 1,
  NAME_LENGTH_MAX: 100,
  PRICE_MIN: 0,
  TAX_RATE_MIN: 0,
  TAX_RATE_MAX: 100,
  MONTH_DAY_MIN: 1,
  MONTH_DAY_MAX: 31,
  RECURRENCE_BASIS_MIN: 1,
  NB_CUSTOM_INTERVAL_MIN: 1,
  NB_FIXED_INTERVAL_MIN: 2,
  NB_FIXED_INTERVAL_MAX: 12,
};

export const DEFAULT_DATA = {
  name: "",
  description: "",
  payment_pack: null,
  payment_pack_details: {
    bookkeeping_account_id: null,
    tax: 0,
  },
  // price
  flat_fee: 0,
  recurrent_price: 0,
  // billing cycle
  interval: BILLING_INTERVALS.MONTH,
  recurrence_basis: 1,
  month_billing_day: null,
  hasCustomInterval: true,
  nb_interval: 1,
  // auto renewal
  auto_renewal: false,
  nb_interval_after_auto_renewal: null,
} satisfies ContractFormData;
