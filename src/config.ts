type ConfigType = {
  REACT_APP_SENTRY_DSN: string;
  REACT_APP_STRIPE_PK_KEY: string;
  REACT_APP_STRIPE_PK_KEY_US: string;
  REACT_APP_GOOGLE_MAPS_API_KEY: string;
  REACT_APP_BASE_URI: string;
  REACT_APP_API_URI: string;
  REACT_APP_RECAPTCHA_V2: string;
  REACT_APP_RECAPTCHA_V3: string;
  REACT_APP_SENTRY_ENVIRONMENT: string;
  NODE_ENV: string;
  REACT_APP_INTERCOM_APP_ID: string;
  PUBLIC_URL: string;
};

export const Config = {} as ConfigType;

function setConfigFrom(envConfig: any) {
  Object.keys(envConfig).forEach((k: keyof ConfigType) => {
    Config[k] = envConfig[k];
  });
}

// @ts-ignore;
const { runtime } = window;
if (process && process.env) setConfigFrom(process.env);
if (runtime && runtime.env) setConfigFrom(runtime.env);

export default Config;

function checkConfigValue(name: keyof ConfigType, silent?: boolean) {
  const value = Config[name];
  if (!value) {
    const text = `The config value for ${name} is invalid (got: ${value})`;
    if (!silent) {
      throw new Error(text);
    } else console.error(text);
  }
}

export function setConfigValue(name: keyof ConfigType, value: string) {
  Config[name] = value;
}

checkConfigValue('REACT_APP_BASE_URI');
checkConfigValue('REACT_APP_API_URI');
checkConfigValue('REACT_APP_STRIPE_PK_KEY');
checkConfigValue('REACT_APP_GOOGLE_MAPS_API_KEY');

if (Config.NODE_ENV === 'production') {
  checkConfigValue('REACT_APP_SENTRY_DSN', true);
}
