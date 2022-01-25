import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import Config from './config';
import RELEASE_SHA from './release-sha';
import { setSessionId } from './sentry/session';
import history from './history';

Sentry.init({
  release: RELEASE_SHA,
  dsn: Config.REACT_APP_SENTRY_DSN || null,
  environment: Config.REACT_APP_SENTRY_ENVIRONMENT || 'production',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 0.01,
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (
      error &&
      // @ts-ignore
      error.message &&
      // @ts-ignore
      (error.message.match(/Loading chunk /i) ||
        // @ts-ignore
        error.message.match(/Loading CSS chunk /i) ||
        // @ts-ignore
        error.message.match(/Object Not Found Matching Id/i) ||
        // @ts-ignore
        error.message.match(/Object Not Found Matching Id/i) ||
        // @ts-ignore
        error.message.match(
          /Cannot read properties of null \(reading 'document'\)/,
        ) ||
        // @ts-ignore
        error.message.match(/Error: timeout of 0ms exceeded/))
    ) {
      return null;
    }
    return event;
  },
});
setSessionId();
