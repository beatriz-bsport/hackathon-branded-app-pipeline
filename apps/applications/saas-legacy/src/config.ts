type ConfigType = {
  REACT_APP_SENTRY_DSN: string;
  REACT_APP_STRIPE_PK_KEY: string;
  REACT_APP_STRIPE_PK_KEY_US: string;
  REACT_APP_GOOGLE_MAPS_API_KEY: string;
  REACT_APP_BASE_URI: string;
  REACT_APP_BASE_URI_BOOK_V0: string;
  REACT_APP_BASE_URI_BOOK_V1: string;
  REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V0: string;
  REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1: string;
  REACT_APP_BASE_URI_BUYABLE_V0: string;
  REACT_APP_BASE_URI_BUYABLE_V1: string;
  REACT_APP_BASE_URI_COMMUNICATE_V0: string;
  REACT_APP_BASE_URI_COMMUNICATE_V1: string;
  REACT_APP_BASE_URI_CORE_V0: string;
  REACT_APP_BASE_URI_CORE_V1: string;
  REACT_APP_BASE_URI_FINANCIAL_SERVICES_V0: string;
  REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1: string;
  REACT_APP_BASE_URI_CDP_V0: string;
  REACT_APP_BASE_URI_CDP_V1: string;
  REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V0: string;
  REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V1: string;
  REACT_APP_BASE_URI_PLATFORM_V0: string;
  REACT_APP_BASE_URI_PLATFORM_V1: string;
  REACT_APP_BASE_URI_STAFF_MANAGEMENT_V0: string;
  REACT_APP_BASE_URI_STAFF_MANAGEMENT_V1: string;
  REACT_APP_API_URI: string;
  REACT_APP_RECAPTCHA_V2: string;
  REACT_APP_RECAPTCHA_V3: string;
  REACT_APP_SENTRY_ENVIRONMENT: string;
  NODE_ENV: string;
  REACT_APP_INTERCOM_APP_ID: string;
  PUBLIC_URL: string;
  I18N_TRANSLATION_DOMAIN: string; // used by the widget
  REACT_APP_CDN_DOMAIN: string;
  REACT_APP_QUICKBOOKS_CLIENT_ID: string;
  REACT_APP_QUICKBOOKS_CLIENT_SECRET: string;
  REACT_APP_SEGMENT_API_KEY: string;
  REACT_APP_RUDDERSTACK_KEY: string;
  REACT_APP_RUDDERSTACK_DATAPLANEURL: string;
  REACT_APP_DEBUGGER_MODE: string;
  REACT_APP_ZOOM_CLIENT_ID: string;
  REACT_APP_PAYPAL_CLIENT_ID: string;
  REACT_APP_PAYPAL_PARTNER_ATTRIBUTION_ID: string;
  REACT_APP_MIXPANEL_TOKEN: string;
  REACT_APP_DIDOMI_API_KEY: string;
  REACT_APP_DIDOMI_NOTICE_ID: string;
  REACT_APP_UNLAYER_PROJECT_ID: string;
};

const Config = {} as ConfigType;

function setConfigFrom(envConfig: any) {
  Object.keys(envConfig).forEach((k: keyof ConfigType) => {
    Config[k] = envConfig[k];
  });
}

const { runtime, runtimeBsport } = window;
if (process && process.env) setConfigFrom(process.env);
if (runtime && runtime.env) setConfigFrom(runtime.env);
if (runtimeBsport && runtimeBsport.env) setConfigFrom(runtimeBsport.env);

export default Config;

if (Config.NODE_ENV === 'production') {
  // checkConfigValue('REACT_APP_SENTRY_DSN', true);
}
