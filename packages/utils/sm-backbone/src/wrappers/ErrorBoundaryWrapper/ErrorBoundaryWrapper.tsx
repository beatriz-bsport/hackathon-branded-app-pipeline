import { ComponentProps, type PropsWithChildren } from "react";

import { ErrorFallback } from "@bsport/kaizen-primitive-core";
import { ApplicationScopeProvider, ErrorBoundary } from "@bsport/sentry";

type ErrorBoundaryWrapperProps = PropsWithChildren<{
  appName: string;
  fallback?: ComponentProps<typeof ErrorBoundary>["fallback"];
}>;

const ERROR_FALLBACK = (
  <ErrorFallback
    className="mx-auto"
    actionProps={ErrorFallback.DEFAULT_ACTION_PROPS}
  />
);

export const ErrorBoundaryWrapper = ({
  appName,
  children,
  fallback = ERROR_FALLBACK,
}: ErrorBoundaryWrapperProps) => {
  return (
    <ApplicationScopeProvider appName={appName}>
      <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
    </ApplicationScopeProvider>
  );
};
