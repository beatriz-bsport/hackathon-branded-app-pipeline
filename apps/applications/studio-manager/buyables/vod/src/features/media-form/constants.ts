import type { MediaFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 500,
  PRICE_MIN: 0,
  RENTAL_DAYS_MIN: 1,
};

export const DEFAULT_RENTAL_DAYS = 30;

export const MEDIA_FORM_DATA_DEFAULT: MediaFormData = {
  name: "",
  description: "",
  credit_price: 0,
  manager_only: false,
  is_rental: false,
  rental_days: DEFAULT_RENTAL_DAYS,
  cover: null,
  category: null,
  level: 1,
  coaches: [],
};
