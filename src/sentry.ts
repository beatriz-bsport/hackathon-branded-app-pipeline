import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import Config from './config';
import RELEASE_SHA from './release-sha';
import { setSessionId } from './sentry/session';
import history from './history';

const exceptionMessageRegexpToIgnore = [
  /Loading chunk /i,
  /Loading CSS chunk /i,
  /Object Not Found Matching Id/i,
  /Object Not Found Matching Id/i,
  /Cannot read properties of null \(reading 'document'\)/, // INTERCOPM
  /Error: timeout of 0ms exceeded/, // RANDOM INTERNET DISCONNECT
  /find variable: _AutofillCallbackHandler/, // FACEBOOK BROWSER
  /find variable: jQuery/,
  /jQuery is not defined/,
];

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
      exceptionMessageRegexpToIgnore.reduce(
        (shouldBeIgnore, regexp) =>
          // @ts-ignore
          shouldBeIgnore || error.message.match(regexp),
        false,
      )
    ) {
      return null;
    }
    return event;
  },
});
setSessionId();
