import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';

import Config from './config';

import './index.css';
import App from './App';
import RELEASE_SHA from './release-sha';
import registerServiceWorker from './registerServiceWorker';
import './material-dashboard-react.css';

import { setSessionId } from './sentry/session';


if (module.hot && process.env.NODE_ENV !== 'production') {
  // When a file change, only reload a module instead of reloading the whole page
  module.hot.accept();
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    release: RELEASE_SHA,
    dsn: Config.REACT_APP_SENTRY_DSN || null,
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT || 'production',
    beforeSend(event, hint) {
      const error = hint.originalException;
      if (
        error &&
        error.message &&
        (error.message.match(/Loading chunk /i) ||
          error.message.match(/Loading CSS chunk /i))
      ) {
        return null;
      }
      return event;
    },
  });
  setSessionId();
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
