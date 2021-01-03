import * as Sentry from '@sentry/browser';

import Config from './config';

import './index.scss';
import './index';
import RELEASE_SHA from './release-sha';
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
        // @ts-ignore
        error.message &&
        // @ts-ignore
        (error.message.match(/Loading chunk /i) ||
          // @ts-ignore
          error.message.match(/Loading CSS chunk /i))
      ) {
        return null;
      }
      return event;
    },
  });
  setSessionId();
}
