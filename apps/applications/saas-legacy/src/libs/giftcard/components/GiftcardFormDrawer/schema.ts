import * as Yup from 'yup';

export const FIELD_PRICE_MIN = 1;
export const FIELD_PRICE_MAX = 1500;
export const FIELD_EXPIRATION_DAYS_MIN = 1;
export const FIELD_ERROR_MAX_PRICE_LOWER_THAN_MIN_PRICE =
  'max_price-must-be-greater-than-min_price';

export const GiftcardSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.mixed().nullable(),
  description: Yup.string().required(),
  manager_only: Yup.boolean(),
  unlimited: Yup.boolean(),
  available_payment_method_identifiers: Yup.array().of(Yup.number()),
  expiration_days: Yup.number().nullable().min(FIELD_EXPIRATION_DAYS_MIN),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
  bookkeeping_account: Yup.number().nullable(),
  price: Yup.number()
    .nullable()
    .integer()
    .min(FIELD_PRICE_MIN)
    .max(FIELD_PRICE_MAX),
  min_price: Yup.number()
    .integer()
    .nullable()
    .min(FIELD_PRICE_MIN)
    .max(FIELD_PRICE_MAX),
  max_price: Yup.number()
    .integer()
    .nullable()
    .min(FIELD_PRICE_MIN)
    .max(FIELD_PRICE_MAX),
});
