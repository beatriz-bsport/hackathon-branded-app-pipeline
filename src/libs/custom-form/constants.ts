import Config from '../../config';

export const emailValidationRegExp =
  /^([A-z0-9-_]|\.)+@[A-z0-9-_.]+(\.[A-z]+)+$/;

export const CUSTOM_FORM_CSS_VARIANT_ACTIVATED =
  Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production';
