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
      fallback={fallback}
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
