import { withScope } from "@sentry/react";

import { uuid } from "@bsport/random-utils";

let sessionId: string | undefined;

export const getSessionId = () => {
  if (!sessionId) {
    sessionId = uuid();
  }
  return sessionId;
};

export const setSessionId = () => {
  const _sessionId = getSessionId();
  try {
    withScope((scope) => {
      scope.setTag("session_id", _sessionId);
    });
  } catch (err) {
    console.error(err);
    return "";
  }
  return _sessionId;
};
