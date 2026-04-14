import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Config from './config';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';
import './material-dashboard-react.css';
import './sentry';

/**
 * Compatibility bridge for Studio Manager remote modules loaded inside saas-legacy.
 * They resolve runtime configuration through window.__SM_RUNTIME__.
 */
const bridgeConfig = {
  API_BASE_URL: Config.REACT_APP_BASE_URI,
  SENTRY_DSN: Config.REACT_APP_SENTRY_DSN,
  MIXPANEL_TOKEN: Config.REACT_APP_MIXPANEL_TOKEN_B2B,
  UNLEASH_PROXY_URL: Config.REACT_APP_UNLEASH_PROXY_URL,
  UNLEASH_CLIENT_KEY: Config.REACT_APP_UNLEASH_CLIENT_KEY,
  UNLEASH_ENVIRONMENT: Config.REACT_APP_UNLEASH_ENVIRONMENT,
};

const sanitizedBridgeConfig = Object.fromEntries(
  Object.entries(bridgeConfig).filter(
    ([, value]) => typeof value === 'string' && value.trim(),
  ),
);

if (Object.keys(sanitizedBridgeConfig).length > 0) {
  window.__SM_RUNTIME__ = {
    ...(window.__SM_RUNTIME__ || {}),
    ...sanitizedBridgeConfig,
  };
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  // When a file change, only reload a module instead of reloading the whole page
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
