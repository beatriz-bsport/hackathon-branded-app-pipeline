import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';

import Config from './config';

import './index.css';
import App from './App';
import RELEASE from './release';
import registerServiceWorker from './registerServiceWorker';

import './material-dashboard-react.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    release: RELEASE,
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
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
