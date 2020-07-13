import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';

import { Integrations as ApmIntegrations } from '@sentry/apm';

import Config from './config';

import './index.css';
import App from './App';
import RELEASE from './release';
import registerServiceWorker from './registerServiceWorker';
import './material-dashboard-react.css';

import { setSessionId } from './sentry/session';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    release: RELEASE,
    dsn: Config.REACT_APP_SENTRY_DSN || null,
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT || 'production',
    integrations: [new ApmIntegrations.Tracing()],
    tracesSampleRate: ['production', 'staging'].includes(
      Config.REACT_APP_SENTRY_ENVIRONMENT,
    )
      ? 0.01
      : 1.0,
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
