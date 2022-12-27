import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

import Config from '../config';
import RELEASE_SHA from '../release-sha';
import { setSessionId } from './session';
import history from '../history';

const exceptionMessageRegexpToIgnore = [
  /Loading chunk /i,
  /Loading CSS chunk /i,
  /Object Not Found Matching Id/i,
  /Object Not Found Matching Id/i,
  /Cannot read properties of null \(reading 'document'\)/, // INTERCOPM
  /timeout of 0ms exceeded/, // RANDOM INTERNET DISCONNECT
  /find variable: _AutofillCallbackHandler/, // FACEBOOK BROWSER
  /find variable: jQuery/,
  /jQuery is not defined/,
  /**
   * Ignore errors reported from CookieFirst (3rd party script)
   * https://sentry.io/organizations/bsport-cg/issues/3183750570/
   */
  /\[CF\] failed to load config files/i,
];

Sentry.init({
  release: RELEASE_SHA,
  dsn: Config.REACT_APP_SENTRY_DSN || null,
  environment: Config.REACT_APP_SENTRY_ENVIRONMENT || 'production',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
    new Replay(),
  ],
  replaysSessionSampleRate:
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
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
