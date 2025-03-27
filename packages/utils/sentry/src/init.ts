import { init } from "@sentry/react";

import {
  ENV,
  ENV_DSN,
  RELEASE_SHA,
  exceptionMessagesToIgnore,
} from "./constants";
import { setSessionId } from "./session";

export const initSentry = () => {
  if (!ENV_DSN) {
    throw new Error("ENV_DSN is not defined");
  }

  init({
    release: RELEASE_SHA,
    dsn: ENV_DSN,
    environment: ENV,
    replaysSessionSampleRate: ENV === "production" ? 0.1 : 1.0,
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

  setSessionId();
};
