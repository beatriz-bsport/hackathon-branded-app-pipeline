import Config from '../../config';

export const emailValidationRegExp =
  /^([A-z0-9-_]|\.)+@[A-z0-9-_.]+(\.[A-z]+)+$/;

export const CUSTOM_FORM_CSS_VARIANT_ACTIVATED =
  Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production';

export const CUSTOM_FORM_FIELD_SIGN_UP_PREFIX = 'sign-up-field';

export const CUSTOM_FORM_FILLED_MAP = {
  custom_form_id: 'custom_form_id',
  custom_form_field_filled: 'custom_form_field_filled',
};
