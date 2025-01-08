import * as Sentry from "@sentry/react";
import { ENV_DSN, RELEASE_SHA, type Env } from "#src/constants";

const exceptionMessagesToIgnore = [
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

export const initSentry = ({ env }: { env: Env }) => {
  if (!ENV_DSN) {
    throw new Error("ENV_DSN is not defined");
  }
  // Missing Sentry.configureScope with session_id and transaction_id

  Sentry.init({
    release: RELEASE_SHA,
    dsn: ENV_DSN,
    environment: env,
    replaysSessionSampleRate: env === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 0.002,
    beforeSend(event, hint) {
      const error = hint.syntheticException;
      if (
        error &&
        error.message &&
        exceptionMessagesToIgnore.reduce(
          (shouldBeIgnore, regexp) =>
            shouldBeIgnore || !!error.message.match(regexp),
          false,
        )
      ) {
        return null;
      }
      return event;
    },
  });
};
