import {
  ErrorBoundary as SentryErrorBoundary,
  type ErrorBoundaryProps as SentryErrorBoundaryProps,
} from "@sentry/react";

import { useApplicationScope } from "#src/components/ApplicationScope";

type ErrorBoundaryProps = SentryErrorBoundaryProps & {
  appName?: string;
};

export const ErrorBoundary = ({
  fallback,
  children,
  appName,
  ...props
}: ErrorBoundaryProps) => {
  const contextAppName = useApplicationScope();
  const currentApp = appName || contextAppName;

  return (
    <SentryErrorBoundary
      fallback={fallback ?? <FallbackUI />}
      {...props}
      beforeCapture={(scope, hint, options) => {
        scope.setTag("application", currentApp);
        scope.setContext("application", { name: currentApp });
        // Call the consumer passed beforeCapture if it exists
        props.beforeCapture?.(scope, hint, options);
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
};

/**
 * Fallback UI for error boundary
 * TODO: Add a proper fallback UI probably coming from kaizen
 * TODO: Add translations
 * Linear link: https://linear.app/bsport/issue/ICH-315/error-handling-improve-fallback-ui-of-the-error-boundary
 */
const FallbackUI = () => (
  <div
    className="error-boundary-fallback"
    style={{
      margin: "2rem auto",
    }}
  >
    <h2>Something went wrong</h2>
    <p>We have been notified about this issue and are working to fix it.</p>
    <button onClick={() => window.location.reload()}>Refresh Page</button>
  </div>
);
