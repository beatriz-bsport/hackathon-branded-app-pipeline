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
