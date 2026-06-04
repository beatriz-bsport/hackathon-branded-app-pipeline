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
  REACT_APP_MIXPANEL_TOKEN_B2B: string;
  REACT_APP_MIXPANEL_TOKEN_B2C: string;
  REACT_APP_DIDOMI_API_KEY: string;
  REACT_APP_DIDOMI_NOTICE_ID: string;
  REACT_APP_UNLAYER_PROJECT_ID: string;
  REACT_APP_UNLEASH_PROXY_URL: string;
  REACT_APP_UNLEASH_CLIENT_KEY: string;
};

const Config = {} as ConfigType;
const STUDIO_RUNTIME_ENV_STORAGE_KEY = '@bsport/studio-runtime-env';
const STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY =
  '@bsport/studio-runtime-field-env-map';
const STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY =
  '@bsport/studio-runtime-api-environment-name';
const STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY =
  '@bsport/studio-runtime-api-environment-override';
const STUDIO_RUNTIME_UPDATED_EVENT = '@bsport/studio-runtime-updated';
const STUDIO_RUNTIME_API_BASE_URL_KEY = 'API_BASE_URL';
const LOCAL_STUDIO_RUNTIME_API_BASE_URL = 'http://localhost:8000';
const DEFAULT_STUDIO_RUNTIME_ENV = 'dev';

type StudioRuntimePayload = {
  API_BASE_URL?: string;
};

function setConfigFrom(envConfig: any) {
  (Object.keys(envConfig) as Array<keyof ConfigType>).forEach((k) => {
    Config[k] = envConfig[k];
  });
}

const normalizeApiBaseUrl = (apiBaseUrl: string) =>
  apiBaseUrl.replace(/\/+$/, '');

const getPathFromUrl = (urlValue: string) => {
  try {
    const parsedUrl = new URL(urlValue);
    if (
      parsedUrl.pathname === '/' &&
      parsedUrl.search === '' &&
      parsedUrl.hash === ''
    ) {
      return '';
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch (_) {
    return undefined;
  }
};

const buildStudioRuntimeApiBaseUrlFromEnvironmentName = (
  environmentName: string,
) => `https://${environmentName}.api.chaos.bsport.io`;

const readLocalStorageItem = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch (_) {
    return null;
  }
};

const readStudioRuntimeApiEnvironmentName = () => {
  const rawValue = readLocalStorageItem(
    STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
  );

  if (typeof rawValue !== 'string') {
    return DEFAULT_STUDIO_RUNTIME_ENV;
  }

  return rawValue.trim().toLowerCase() || DEFAULT_STUDIO_RUNTIME_ENV;
};

const readStudioRuntimeApiEnvironmentOverride = () => {
  return (
    readLocalStorageItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
    ) === 'true'
  );
};

const readStoredApiRuntimeFieldEnv = () => {
  try {
    const rawValue = readLocalStorageItem(
      STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY,
    );
    const parsedValue =
      typeof rawValue === 'string' ? JSON.parse(rawValue) : undefined;
    const apiRuntimeEnv = parsedValue?.[STUDIO_RUNTIME_API_BASE_URL_KEY];

    return typeof apiRuntimeEnv === 'string'
      ? apiRuntimeEnv.trim().toLowerCase()
      : undefined;
  } catch (_) {
    return undefined;
  }
};

const canApplyStudioRuntimeApiBaseUrlOverride = () => {
  const hostname = window.location.hostname;

  if (
    hostname === 'backoffice.bsport.io' ||
    hostname === 'backoffice.staging.bsport.io'
  ) {
    return false;
  }

  return true;
};

const readStoredStudioRuntimeApiBaseUrlOverride = () => {
  if (!canApplyStudioRuntimeApiBaseUrlOverride()) {
    return undefined;
  }

  if (readStudioRuntimeApiEnvironmentOverride()) {
    return buildStudioRuntimeApiBaseUrlFromEnvironmentName(
      readStudioRuntimeApiEnvironmentName(),
    );
  }

  if (readStoredApiRuntimeFieldEnv() === 'local') {
    return LOCAL_STUDIO_RUNTIME_API_BASE_URL;
  }

  const selectedRuntimeEnv = readLocalStorageItem(
    STUDIO_RUNTIME_ENV_STORAGE_KEY,
  );
  if (selectedRuntimeEnv?.trim().toLowerCase() === 'local') {
    return LOCAL_STUDIO_RUNTIME_API_BASE_URL;
  }

  return undefined;
};

const applyStudioRuntimeApiBaseUrlOverride = (
  apiBaseUrl: string | undefined,
) => {
  const currentApiBaseUrl = Config.REACT_APP_BASE_URI;

  if (
    !canApplyStudioRuntimeApiBaseUrlOverride() ||
    typeof apiBaseUrl !== 'string' ||
    typeof currentApiBaseUrl !== 'string' ||
    apiBaseUrl.trim() === '' ||
    currentApiBaseUrl.trim() === ''
  ) {
    return;
  }

  const normalizedCurrentApiBaseUrl = normalizeApiBaseUrl(currentApiBaseUrl);
  const normalizedNextApiBaseUrl = normalizeApiBaseUrl(apiBaseUrl);

  (Object.keys(Config) as Array<keyof ConfigType>)
    .filter(
      (configKey) =>
        configKey === 'REACT_APP_API_URI' ||
        configKey.startsWith('REACT_APP_BASE_URI'),
    )
    .forEach((configKey) => {
      const configValue = Config[configKey];
      if (
        typeof configValue !== 'string' ||
        !configValue.startsWith(normalizedCurrentApiBaseUrl)
      ) {
        return;
      }

      const configValuePath = getPathFromUrl(configValue);
      if (typeof configValuePath !== 'string') {
        return;
      }

      Config[configKey] = `${normalizedNextApiBaseUrl}${configValuePath}`;
    });
};

const { runtime, runtimeBsport } = window;
if (process && process.env) setConfigFrom(process.env);
if (runtime && runtime.env) setConfigFrom(runtime.env);
if (runtimeBsport && runtimeBsport.env) setConfigFrom(runtimeBsport.env);
applyStudioRuntimeApiBaseUrlOverride(
  readStoredStudioRuntimeApiBaseUrlOverride(),
);

window.addEventListener(STUDIO_RUNTIME_UPDATED_EVENT, (event) => {
  const runtimePayload = (
    event as CustomEvent<{ runtime?: StudioRuntimePayload }>
  ).detail?.runtime;

  applyStudioRuntimeApiBaseUrlOverride(runtimePayload?.API_BASE_URL);
});

export default Config;

if (Config.NODE_ENV === 'production') {
  // checkConfigValue('REACT_APP_SENTRY_DSN', true);
}
