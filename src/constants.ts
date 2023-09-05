export enum BsportRequestFromHeaderValue {
  WIDGET = 'widget',
  BRIDGE = 'bridge',
  SAAS_LOGIN_ROUTER = 'login-router',
  SAAS_DEPRECATED_PAYMENT = 'deprecated-payment',
  SAAS_CONSUMER_ROUTER = 'consumer-router',
  SAAS_MARKETPLACE_ROUTER = 'marketplace-router',
  SAAS_RN_WEBVIEW = 'rn-webview',
  SAAS_EMAIL_CONFIRMATION = 'email-confirmation',
  SAAS_FRANCHISE_BACKOFFICE = 'franchise-backoffice',
  SAAS_ACCOUNT_CONFIGURATION = 'account-configuration',
  SAAS_BACKOFFICE = 'backoffice',
}

export const BSPORT_REQUEST_FROM_HEADER = 'X-bsport-request-from';
export const BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION =
  'bsport-request-from';

/**
 *  @description The given sequence is a regular expression that represents a pattern for a date in the format "dd/mm/yyyy.
 */
export const DATE_PICKER_MASK = [
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
/**
 * @description In order to avoid 6-digits numbers for all taxes, we limit the number of digits to 5.
 */
export const ALMOST_100 = 99.999;
