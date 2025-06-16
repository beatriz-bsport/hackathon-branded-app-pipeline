import { setTag } from "@sentry/react";

import { uuid } from "@bsport/random-utils";

/**
 * We want to have a session id so we can group errors by session
 * session is defined as the time a user is interacting with the app with the same browser
 * without closing the browser or refreshing the page
 */
let sessionId: string | undefined;

/**
 * Gets or creates a persistent session ID and sets it in Sentry for error correlation.
 *
 * Session ID persists throughout the browser session (until page refresh or browser close)
 * and is used to group related errors and user actions together in Sentry.
 *
 * @returns {string} The session ID that was set in Sentry
 *
 * @example
 * // Used in HTTP headers to correlate frontend/backend logs
 * const sessionId = getSessionId(); // "X-Session-ID": sessionId
 */
export const getSessionId = () => {
  if (!sessionId) {
    sessionId = uuid();
  }

  try {
    setTag("session_id", sessionId);
  } catch (err) {
    console.warn("Failed to set session id", err);
  }

  return sessionId;
};

/**
 * Generates and sets a unique transaction ID in Sentry for request tracing.
 *
 * Unlike session ID, transaction ID is unique per call and used for:
 * - Correlating frontend errors with backend API logs
 * - Distributed tracing across microservices
 * - Request debugging and support troubleshooting
 * - Performance monitoring of end-to-end user actions
 *
 * @returns {string} A unique transaction ID that was set in Sentry
 *
 * @example
 * // Used in HTTP headers for request correlation
 * const transactionId = getTransactionId(); // "X-Transaction-ID": transactionId
 *
 * // Each API call gets a unique transaction ID for tracing
 * fetch('/api/bookings', {
 *   headers: { 'X-Transaction-ID': getTransactionId() }
 * });
 */
export const getTransactionId = () => {
  const transactionId = uuid();

  try {
    setTag("transaction_id", transactionId);
  } catch (err) {
    console.warn("Failed to set transaction id", err);
  }

  return transactionId;
};
