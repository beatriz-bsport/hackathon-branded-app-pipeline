import { ComponentProps, type PropsWithChildren } from "react";

import { ApplicationScopeProvider, ErrorBoundary } from "@bsport/sentry";

type ErrorBoundaryWrapperProps = PropsWithChildren<{
  appName: string;
  fallback?: ComponentProps<typeof ErrorBoundary>["fallback"];
}>;

export const ErrorBoundaryWrapper = ({
  appName,
  children,
  fallback,
}: ErrorBoundaryWrapperProps) => {
  return (
    <ApplicationScopeProvider appName={appName}>
      <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
    </ApplicationScopeProvider>
  );
};
