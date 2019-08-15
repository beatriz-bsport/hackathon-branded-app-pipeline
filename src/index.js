import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';

import Config from './config';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './material-dashboard-react.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    release: 'fd527d0deba4c74d679eebf631f97341212ae148',
    dsn: Config.REACT_APP_SENTRY_DSN || null,
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT || 'production',
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
