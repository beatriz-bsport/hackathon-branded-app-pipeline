import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import Config from '../config';
import RELEASE_SHA from '../release-sha';
import { setSessionId } from './session';
import history from '../history';

if (Config.NODE_ENV === 'production') {
  Sentry.init({
    release: RELEASE_SHA,
    dsn: Config.REACT_APP_SENTRY_DSN || null,
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      }),
    ],
    tracesSampleRate: 0.01,
    beforeSend(event, hint) {
      const error = hint.originalException;
      if (
        (error &&
          // @ts-ignore
          error.message &&
          // @ts-ignore
          (error.message.match(/Loading chunk /i) ||
            // @ts-ignore
            error.message.match(/find variable: jQuery/i) || // this happened for a client inside his GTM
            // @ts-ignore
            error.message.match(/Loading CSS chunk /i))) ||
        // @ts-ignore
        error.message.match(/Object Not Found Matching Id/i)
      ) {
        return null;
      }
      return event;
    },
  });
}
setSessionId();
