export { initSentry } from "./init";
export { ApplicationScopeProvider } from "./components/ApplicationScope";
export { ErrorBoundary } from "./components/ErrorBoundary";
export { getSessionId, getTransactionId } from "./session";

// Re-export commonly used Sentry functions
export {
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  setTag,
  setContext,
  withScope,
  configureScope,
  getCurrentHub,
  startTransaction,
} from "@sentry/react";
