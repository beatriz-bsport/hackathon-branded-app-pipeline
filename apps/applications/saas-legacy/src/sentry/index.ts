import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

import Config from '../config';
// @ts-expect-error
import RELEASE_SHA from '../release-sha';
import { setSessionId } from './session';
import history from '../history';
import { SENTRY_FRONTEND_MODULE_TAG_NAME } from '#src/sentry/types';
import { getVerticalOwnerByPageUrl } from '#src/sentry/utils';

const exceptionMessageRegexpToIgnore = [
  /Loading chunk /i,
  /Loading CSS chunk /i,
  /Object Not Found Matching Id/i,
  /Object Not Found Matching Id/i,
  /Cannot read properties of null \(reading 'document'\)/, // INTERCOM
  /null is not an object \(evaluating 'parent.document'\)/, // INTERCOM (SAME) BUT MORE RECENT
  /timeout of 0ms exceeded/, // RANDOM INTERNET DISCONNECT
  /find variable: _AutofillCallbackHandler/, // FACEBOOK BROWSER
  /find variable: jQuery/,
  /jQuery is not defined/,
  /**
   * Ignore errors reported from CookieFirst (3rd party script)
   * https://sentry.io/organizations/bsport-cg/issues/3183750570/
   */
  /\[CF\] failed to load config files/i,
  /\[CF\] failed to load configs, check api key/i,
  /**
   * Ignore undefined jQuery variable $ for widget context (Google Tag Manager)
   * https://bsport-cg.sentry.io/issues/4802227038
   */
  /Can't find variable: \$/,
  /\$ is not defined/,
  /**
   * Ignore Axios 500 errors
   * https://bsport-cg.sentry.io/issues/1574738750
   * https://bsport-cg.sentry.io/issues/1574939281
   */
  /Request failed with status code 500/,
  /Network Error/,
  /Maximum call stack size exceeded/,
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
  tracesSampleRate: 0.002,
  beforeSend(event, hint) {
    if (Config.REACT_APP_SENTRY_ENVIRONMENT === 'local') {
      // eslint-disable-next-line no-console
      console.log('🔍 Sentry Event:', { event, hint });
    }
    const currentUrl = window?.location.pathname || '';
    const verticalOwner = getVerticalOwnerByPageUrl(currentUrl);
    const error = hint.originalException;
    if (
      error &&
      // @ts-expect-error
      error.message &&
      exceptionMessageRegexpToIgnore.reduce(
        (shouldBeIgnore, regexp) =>
          // @ts-expect-error
          shouldBeIgnore || error.message.match(regexp),
        false,
      )
    ) {
      return null;
    }
    if (error instanceof Error) {
      event.tags = {
        ...event.tags,
        [SENTRY_FRONTEND_MODULE_TAG_NAME]: verticalOwner,
      };
    }
    return event;
  },
});
setSessionId();
