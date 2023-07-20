import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';

export const sessionId = uuidv4();
export const getSessionId = () => sessionId;

export const setSessionId = () => {
  const _sessionId = getSessionId();
  try {
    Sentry.configureScope((scope) => {
      scope.setTag('session_id', _sessionId);
    });
  } catch (err) {
    console.error(err);
    return '';
  }
  return _sessionId;
};
