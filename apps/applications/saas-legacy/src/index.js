import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';
import './material-dashboard-react.css';
import './sentry';

/**
 * Compatibility bridge for Studio Manager remote modules loaded inside saas-legacy.
 * They resolve API domains through window.__SM_RUNTIME__.API_BASE_URL.
 * In saas-legacy, env.js exposes the backend domain via window.runtime.env.REACT_APP_BASE_URI.
 */
const runtimeApiBaseUrl =
  window?.runtime?.env?.REACT_APP_BASE_URI ??
  window?.runtimeBsport?.env?.REACT_APP_BASE_URI;

if (typeof runtimeApiBaseUrl === 'string' && runtimeApiBaseUrl.trim()) {
  window.__SM_RUNTIME__ = {
    ...(window.__SM_RUNTIME__ || {}),
    API_BASE_URL: runtimeApiBaseUrl.trim(),
  };
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  // When a file change, only reload a module instead of reloading the whole page
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
