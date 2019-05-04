// @flow

export const Config = {};

function setConfigFrom(envConfig) {
  Object.keys(envConfig).forEach((k) => {
    Config[k] = envConfig[k];
  });
}

const { runtime } = window;
if (process && process.env) setConfigFrom(process.env);
if (runtime && runtime.env) setConfigFrom(runtime.env);

export default Config;

function checkConfigValue(name, silent) {
  const value = Config[name];
  if (!value) {
    const text = `The config value for ${name} is invalid (got: ${value})`;
    if (!silent) {
      throw new Error(text);
    } else console.error(text);
  }
}

checkConfigValue('REACT_APP_BASE_URI');
checkConfigValue('REACT_APP_STRIPE_PK_KEY');
checkConfigValue('REACT_APP_GOOGLE_MAPS_API_KEY');

if (Config.NODE_ENV === 'production') {
  checkConfigValue('REACT_APP_SENTRY_DSN', true);
  checkConfigValue('REACT_APP_CRISP_WEBSITE_ID');
}
