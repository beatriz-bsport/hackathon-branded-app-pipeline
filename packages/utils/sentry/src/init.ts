import { init } from "@sentry/react";

import { getEnv } from "@bsport/envs";

import {
  ENV_DSN,
  RELEASE_SHA,
  SEND_ERRORS_IN_LOCAL_DEVELOPMENT,
  exceptionMessagesToIgnore,
} from "./constants";
import { getSessionId } from "./session";

declare global {
  interface Window {
    __MAINTENANCE_MODE__?: boolean;
  }
}

type Params = {
  integrations?: Parameters<typeof init>["0"]["integrations"];
};

export const initSentry = (params: Params = { integrations: [] }) => {
  if (!ENV_DSN) {
    console.warn(
      "[Sentry] ENV_DSN is not defined. Sentry initialization skipped.",
    );
    return;
  }

  const env = getEnv();

  init({
    release: RELEASE_SHA,
    dsn: ENV_DSN,
    environment: env,
    integrations: params.integrations,
    replaysSessionSampleRate: env === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 0.002,
    beforeSend(event, hint) {
      const error = hint.syntheticException;

      const shouldBeIgnored =
        !!error?.message &&
        exceptionMessagesToIgnore.some((regexp) => regexp.test(error.message));

      const shouldIgnoreLocalhostErrors =
        !SEND_ERRORS_IN_LOCAL_DEVELOPMENT && env === "local";

      if (
        shouldBeIgnored ||
        shouldIgnoreLocalhostErrors ||
        window.__MAINTENANCE_MODE__ === true
      ) {
        console.warn("Error ignored by Sentry", error);
        return null;
      }
      return event;
    },
  });

  getSessionId();
};
