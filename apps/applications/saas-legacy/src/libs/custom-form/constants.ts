import Config from '../../config';

export const emailValidationRegExp =
  /^([A-z0-9-_]|\.)+@[A-z0-9-_.]+(\.[A-z]+)+$/;

export const CUSTOM_FORM_CSS_VARIANT_ACTIVATED =
  Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production';

// IDs of the companies that have the css version of the custom forms activated
// TEMPORARY: This is a temporary solution, we should remove this when the css version of the custom forms will be activated for all companies
export const ID_COMPANIES_CUSTOM_FORM_CSS_VARIANT_ACTIVATED = [
  498, 2427, 1496, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1654,
  1900, 3830, 485, 2045, 1058, 2960, 808, 3046, 2561,
];

export const CUSTOM_FORM_FIELD_SIGN_UP_PREFIX = 'sign-up-field';

export const CUSTOM_FORM_FILLED_MAP = {
  custom_form_id: 'custom_form_id',
  custom_form_field_filled: 'custom_form_field_filled',
};
